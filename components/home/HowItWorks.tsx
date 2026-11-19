const steps = [
  {
    icon: '🎯',
    title: 'Pick a subject & experiment',
    text: 'Choose Biology, Chemistry, Physics or Agriculture and open a curriculum-aligned practical.',
  },
  {
    icon: '🧭',
    title: 'Follow the guided procedure',
    text: 'The lab walks you through the apparatus, safety rules and every stage of the experiment.',
  },
  {
    icon: '🔍',
    title: 'Observe, measure & record',
    text: 'Run the simulation, capture your observations and enter measurements and results.',
  },
  {
    icon: '✅',
    title: 'Get instant feedback',
    text: 'Work is scored immediately with personalised hints from the NovaLab AI assistant.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mt-20 scroll-mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">How the lab is used</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          From opening a lesson to getting feedback, every practical follows the same simple,
          guided flow so students can focus on doing real science.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition"
          >
            <div className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow">
              {index + 1}
            </div>
            <div className="text-3xl mb-3 mt-4">{step.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm leading-6 text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
