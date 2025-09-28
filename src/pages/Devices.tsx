import DevicesHub from "@/components/iot/DevicesHub";

export default function Devices() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">IoT Devices</h1>
          <p className="text-muted-foreground">Connect your wearables and medical devices, and see unified wellness analytics.</p>
        </div>
        <DevicesHub />
      </div>
    </div>
  );
}
