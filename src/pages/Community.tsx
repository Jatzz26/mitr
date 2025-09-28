import CommunityHub from "@/components/community/CommunityHub";

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Care & Community</h1>
          <p className="text-muted-foreground">Safe, moderated peer support with professional participation, channels, and threads.</p>
        </div>
        <CommunityHub />
      </div>
    </div>
  );
}
