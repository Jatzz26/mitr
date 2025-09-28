import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Activity, Stethoscope, Trash2, History, LineChart, Images, FileUp } from "lucide-react";
import InsightsModal from "./InsightsModal";
import MedPlusChat from "./MedPlusChat";
import type { HealthRecord } from "@/types/health";
import { supabase } from "@/lib/supabaseClient";

function authHeader(): Record<string, string> {
  const token = (supabase as any)?.auth?.session()?.access_token;
  const ls = typeof window !== "undefined" ? localStorage.getItem("sb-access-token") : null;
  const t = token || (ls ? JSON.parse(ls)?.access_token : null);
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function useLatestInsights() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('report_insights').select('*').order('generated_at',{ascending:false});
    setRows(data || []);
  })(); },[]);
  return rows;
}

function InsightsGrid({ records, onOpen }: { records: HealthRecord[]; onOpen: (r: HealthRecord)=>void }){
  const insights = useLatestInsights();
  const latestByRecord = useMemo(()=>{
    const map = new Map<string, any>();
    for(const row of insights){ if(!map.has(row.health_record_id)) map.set(row.health_record_id,row); }
    return map;
  },[insights]);
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {records.map(r=>{
        const ins = latestByRecord.get(r.id);
        return (
          <Card key={r.id} className="bg-card border border-card-border hover:shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{r.metadata?.test_name || r.record_type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">{new Date(r.uploaded_at).toLocaleDateString()}</div>
              <p className="text-sm line-clamp-3">{ins?.summary_text || 'No insights yet. Run analysis.'}</p>
              <div className="text-xs rounded-md border p-2 bg-muted/30 max-h-28 overflow-auto">
                {ins?.chart_data ? <pre className="text-[11px] whitespace-pre-wrap">{JSON.stringify(ins.chart_data)}</pre> : '—'}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={()=>onOpen(r)}>Analyze / View</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TrendsPanel(){
  const [insights, setInsights] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('report_insights').select('*').order('generated_at',{ascending:true});
    setInsights(data || []);
  })(); },[]);

  // Simple aggregation: pick LDL/HDL/ALT if present
  const series = useMemo(()=>{
    const pts: { ts: string; LDL?: number; HDL?: number; ALT?: number }[] = [];
    for(const ins of insights){
      const s = ins.chart_data?.series as any[] | undefined;
      if(!Array.isArray(s)) continue;
      const row: any = { ts: ins.generated_at };
      for(const item of s){
        if(['LDL','HDL','ALT'].includes(item.name)) row[item.name] = Number(item.value);
      }
      pts.push(row);
    }
    return pts;
  },[insights]);

  return (
    <Card className="bg-card border border-card-border">
      <CardHeader><CardTitle className="text-base">Key Trends (LDL/HDL/ALT)</CardTitle></CardHeader>
      <CardContent>
        {series.length===0 ? (
          <p className="text-sm text-muted-foreground">No trend data yet. Analyze some records first.</p>
        ) : (
          <div className="text-xs overflow-auto rounded border p-2 bg-muted/30">
            <pre>{JSON.stringify(series, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HealthLocker() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<HealthRecord | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"upload" | "records" | "insights" | "trends">("upload");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { fetchRecords(); }, []);

  async function fetchRecords() {
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (!error) setRecords(data || []);
  }

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & {
      record_type: HTMLInputElement;
      metadata: HTMLInputElement;
      file: HTMLInputElement;
      consent: HTMLInputElement;
    };
    if (!form.file.files?.[0]) return;
    setUploading(true);
    try {
      if (!form.consent.checked) throw new Error("Consent required");
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not signed in");
      const file = form.file.files[0];
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const up = await supabase.storage.from("health-records").upload(path, file, { upsert: false });
      if (up.error) throw up.error;
      // For demo, use public URL; switch to signed URL later
      const pub = supabase.storage.from("health-records").getPublicUrl(up.data.path);
      const file_url = pub.data.publicUrl;
      let metadata: any = {};
      try { metadata = form.metadata.value ? JSON.parse(form.metadata.value) : {}; } catch {}
      // Store storage path inside metadata for signed URLs & safe delete later
      metadata = { ...metadata, storage_path: up.data.path };
      const ins = await supabase.from("health_records").insert({
        user_id: user.id,
        record_type: form.record_type.value,
        metadata,
        file_url,
      });
      if (ins.error) throw ins.error;
      await fetchRecords();
      form.reset();
    } finally { setUploading(false); }
  }

  async function deleteRecord(r: HealthRecord) {
    // Attempt to remove storage file if we know the path from metadata
    const path = (r.metadata && (r.metadata.storage_path || r.metadata.path)) as string | undefined;
    if (path) {
      await supabase.storage.from("health-records").remove([path]);
    }
    const { error } = await supabase.from("health_records").delete().eq("id", r.id);
    if (!error) setRecords((arr) => arr.filter((x) => x.id !== r.id));
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button variant={tab==='upload'?'default':'outline'} size="sm" onClick={()=>setTab('upload')}><FileUp className="w-4 h-4 mr-1"/>Upload</Button>
        <Button variant={tab==='records'?'default':'outline'} size="sm" onClick={()=>setTab('records')}><History className="w-4 h-4 mr-1"/>Records</Button>
        <Button variant={tab==='insights'?'default':'outline'} size="sm" onClick={()=>setTab('insights')}><Activity className="w-4 h-4 mr-1"/>Insights</Button>
        <Button variant={tab==='trends'?'default':'outline'} size="sm" onClick={()=>setTab('trends')}><LineChart className="w-4 h-4 mr-1"/>Trends</Button>
      </div>

      {/* Upload Tab */}
      {tab==='upload' && (
        <Card className="bg-card border border-card-border">
          <CardHeader><CardTitle className="text-base">Upload record</CardTitle></CardHeader>
          <CardContent>
            {/* Drag and drop area */}
            <div
              className={`mb-4 rounded-xl border-2 border-dashed p-6 text-center ${dragOver? 'border-primary bg-primary/5':'border-muted'}`}
              onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={async (e)=>{
                e.preventDefault(); setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                // Populate hidden form input for convenience
                const input = document.querySelector<HTMLInputElement>('input[name="file"]');
                if (input) { const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files; }
              }}
            >
              <Images className="w-6 h-6 mx-auto text-muted-foreground"/>
              <div className="mt-2 text-sm text-muted-foreground">Drag & drop your PDF/Image/JSON here, or use the form below</div>
            </div>
            <form onSubmit={onUpload} className="space-y-3">
              <input name="record_type" className="w-full border rounded-md px-3 py-2 bg-background" placeholder="lab_test / imaging / vitals" required />
              <input name="metadata" className="w-full border rounded-md px-3 py-2 bg-background" placeholder='{"test_name":"Lipid"}' />
              <input name="file" type="file" className="w-full" required />
              <label className="flex items-center gap-2 text-sm">
                <input name="consent" type="checkbox" required /> I consent to AI processing
              </label>
              <Button type="submit" className="w-full" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Records Tab - timeline */}
      {tab==='records' && (
        <div className="space-y-3">
          {records.length===0 && <p className="text-sm text-muted-foreground">No records yet. Upload your first report.</p>}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {records.map((r) => (
              <Card key={r.id} className="bg-card border border-card-border hover:shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" /> {r.metadata?.test_name || r.record_type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">{new Date(r.uploaded_at).toLocaleString()}</div>
                  <p className="text-sm line-clamp-3">{r.metadata?.notes || "No summary yet"}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setActiveRecord(r); setShowInsights(true); }}>
                      <Activity className="w-4 h-4 mr-1" /> View Insights
                    </Button>
                    <Button size="sm" onClick={() => { setActiveRecord(r); }}>
                      <Stethoscope className="w-4 h-4 mr-1" /> Chat about this
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => deleteRecord(r)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab - latest per record */}
      {tab==='insights' && <InsightsGrid records={records} onOpen={(r)=>{ setActiveRecord(r); setShowInsights(true); }} />}

      {/* Trends Tab - aggregate */}
      {tab==='trends' && <TrendsPanel />}

      <InsightsModal open={showInsights} onClose={() => setShowInsights(false)} record={activeRecord} />
      <MedPlusChat record={activeRecord} />
    </div>
  );
}
