import ProviderTester from "@/components/provider-tester";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            🧪 AI Provider Testing
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Verify that your AI providers are working correctly
          </p>
        </div>
        
        <ProviderTester />
      </div>
    </div>
  );
}
