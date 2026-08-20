export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What is Flow NextGen?",
    answer: "Flow NextGen is a Chrome extension that automates bulk AI image and video generation on Google Flow. Queue hundreds of prompts, and the extension runs them automatically while you work on other things."
  },
  {
    question: "Is it free?",
    answer: "Yes, there is a free tier that gives you 30 prompts per 6 hours with DOM simulation mode. The Pro tier at $9.99/month unlocks unlimited generation, API-first mode, auto-download, 4K upscaling, native character consistency, and priority features."
  },
  {
    question: "How does Native Character Consistency work?",
    answer: "Flow NextGen parses @handle definitions in your prompts and automatically binds them to Google Flow's native character entities (chips). If native chip verification degrades, the engine seamlessly falls back to prompt text expansion so your characters remain consistent across generations."
  },
  {
    question: "What are Flow Packets?",
    answer: "Flow Packets are shareable JSON or TXT bundles containing your prompt suites, generation mode settings, and @handle character mappings. You can export your configuration in one click or import external packets to instantly populate your queue."
  },
  {
    question: "What models does it support?",
    answer: "Video generation uses Veo 3.1 (Lite, Fast, or Quality mode) and Omni Flash. Image generation uses Nano Banana Pro, Nano Banana 2, and Banana 2 Lite. All are Google's latest models available through Google Flow."
  },
  {
    question: "How do I get started?",
    answer: "Install the extension from the Chrome Web Store, pin it to your toolbar, and open Google Flow in a tab. Click the extension icon to open the sidepanel, sign in with your email, and you're ready to queue your first prompts."
  },
  {
    question: "How is this different from manually using Google Flow?",
    answer: "Instead of typing prompts one at a time and waiting for each to finish, you paste your entire list at once. The extension handles the clicking, waiting, retrying, and downloading, while you focus on creative work."
  },
  {
    question: "Where can I get help?",
    answer: "Join our Discord community for support, feature requests, and updates. You can also check the Guide page for detailed walkthroughs of each feature."
  },
  {
    question: "Is Flow NextGen affiliated with Google?",
    answer: "No. Flow NextGen is an independent Chrome extension built by a third-party developer. We are not endorsed by, affiliated with, or sponsored by Google or Google Flow. The $9.99/month Pro subscription covers this extension's automation features only, you still need your own Google account and access to labs.google/fx/tools/flow. Google Flow's own Pro/Ultra tiers are completely separate."
  }
];
