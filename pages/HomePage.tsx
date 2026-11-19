import { Link } from 'react-router-dom';
import SubjectIcon from '@components/ui/SubjectIcon';
import HowItWorks from '@components/home/HowItWorks';
import DemoSection from '@components/home/DemoSection';
import type { Subject } from '../types';

const backgroundImage = '/img233.webp';

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.72), rgba(239,246,255,0.82)), url(${backgroundImage})`,
      }}
    >
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/novalab-logo.png" alt="NovaLabs" className="h-12 sm:h-14 w-auto drop-shadow-sm" />
          </div>
          <div className="space-x-4">
            <Link
              to="/pricing"
              className="px-6 py-2 text-blue-600 hover:text-blue-900 font-medium transition"
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 text-blue-600 hover:text-blue-900 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <img
            src="/novalab-logo.png"
            alt="NovaLabs"
            className="h-16 sm:h-20 w-auto mx-auto mb-6 drop-shadow-sm"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="block text-blue-600">For Schools Uganda</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto">
            Curriculum aligned 3D simulations for remote, secondary and on campus learning,
            progress tracking and while ensuring a low cost and risk free environment.
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Deliver engaging practical science learning with safe, affordable digital laboratory experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-lg"
            >
              Open in App
            </Link>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-white text-blue-700 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition text-lg"
            >
              Continue on Web
            </Link>
            <Link
              to="/physical-lab"
              className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-lg"
            >
              Try the hands-on lab
            </Link>
            <a
              href="#demo"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition text-lg"
            >
              ▶ Watch the demo
            </a>
          </div>
        </div>

        {/* Subjects Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <SubjectCard
            subject="biology"
            title="Biology"
            description="DNA extraction, cell division, genetics, and ecology experiments"
            color="from-green-100 to-green-50"
          />
          <SubjectCard
            subject="chemistry"
            title="Chemistry"
            description="Titrations, equilibrium, thermochemistry simulations"
            color="from-purple-100 to-purple-50"
          />
          <SubjectCard
            subject="physics"
            title="Physics"
            description="Mechanics, optics, circuits, and waves experiments"
            color="from-yellow-100 to-yellow-50"
          />
          <SubjectCard
            subject="agriculture"
            title="Agriculture"
            description="Soil analysis, crop management simulations"
            color="from-amber-100 to-amber-50"
          />
        </div>

        {/* How the lab is used */}
        <HowItWorks />

        {/* Read More About Us */}
        <section className="mt-20 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Read More About Us</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              NovaLabs is Uganda's leading provider of curriculum-aligned virtual science laboratories. 
              We empower schools with safe, affordable, and risk-free digital practical experiences that 
              bring science to life. Our platform combines interactive 3D simulations, AI-guided assistance, 
              and real-time feedback to enhance learning outcomes for students across Biology, Chemistry, 
              Physics, and Agriculture.
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
              Designed specifically for Ugandan secondary schools, our labs follow the National Curriculum 
              Development Centre (NCDC) competency-based curriculum. We bridge the gap between theory and 
              practice, ensuring every student gets hands-on experience regardless of their school's 
              laboratory resources.
            </p>
          </div>
        </section>

        {/* Book Installations */}
        <section className="mt-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Book Installations of Our Virtual Lab</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Bring NovaLabs virtual science laboratory to your school. We provide on-site installation, 
              teacher training, and ongoing technical support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🏫</div>
              <h3 className="font-bold text-lg mb-2">School Wide Deployment</h3>
              <p className="text-blue-100 text-sm">Full lab setup for all students and teachers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <h3 className="font-bold text-lg mb-2">Teacher Training</h3>
              <p className="text-blue-100 text-sm">Comprehensive training on platform usage</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-bold text-lg mb-2">Ongoing Support</h3>
              <p className="text-blue-100 text-sm">Technical support and maintenance</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="https://wa.me/256700000000?text=Hello%2C%20I%20would%20like%20to%20book%20installation%20of%20NovaLabs%20Virtual%20Lab%20for%20my%20school"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.34 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.3a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1.01 2.56.14.17 1.75 2.67 4.23 3.74.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3 0-.47 0z" />
              </svg>
              Book Installation via WhatsApp
            </a>
          </div>
        </section>

        {/* What Clients Say About Us */}
        <section className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Clients Say About Us</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from educators and administrators using NovaLabs in their schools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-700 italic mb-4">
                "NovaLabs has transformed how our students learn science. The virtual labs are engaging 
                and have improved our practical exam performance significantly."
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">Mr. James Okello</p>
                <p className="text-sm text-gray-600">Head Teacher, Kampala Secondary School</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-700 italic mb-4">
                "The AI assistant is incredibly helpful. Students can get guidance anytime, and the 
                curriculum alignment with NCDC is perfect for our needs."
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">Ms. Sarah Nakato</p>
                <p className="text-sm text-gray-600">Science Teacher, Mbarara High School</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-700 italic mb-4">
                "Cost-effective solution that gives all students access to quality practical science. 
                The offline capability is perfect for schools with limited internet."
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">Dr. Robert Mugisha</p>
                <p className="text-sm text-gray-600">Director of Studies, Gulu Academy</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI-guided demo video */}
        <DemoSection />

        {/* Partners */}
        <section className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              NovaLab content is aligned with Uganda's national curriculum, developed in partnership with the
              institutions that shape science education in our country.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PartnerCard
              logo="/logos/ncdc.png"
              name="National Curriculum Development Centre (NCDC)"
              description="Curriculum alignment partner. Our virtual labs follow the competency-based curriculum developed by NCDC for pre-primary, primary, and secondary schools in Uganda."
              href="https://ncdc.go.ug/"
            />
            <PartnerCard
              logo="/logos/moes.png"
              name="Ministry of Education and Sports"
              description="Our work supports the Ministry's vision of quality education and sports for all, delivering safe and affordable practical science learning to secondary schools across Uganda."
              href="https://www.education.go.ug/"
            />
          </div>
        </section>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📱"
            title="Mobile-First Design"
            description="Works seamlessly on phones, tablets, and computers"
          />
          <FeatureCard
            icon="🔌"
            title="Offline-First"
            description="Full functionality without internet connection"
          />
          <FeatureCard
            icon="📊"
            title="Real-Time Feedback"
            description="Immediate scoring and personalized suggestions"
          />
        </div>

        {/* Statistics */}
        <div className="mt-20 bg-blue-900 text-white rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard number="60%" label="Reduction in laboratory costs" />
            <StatCard number="90%" label="Risk reduction" />
            <StatCard number="82%" label="Improved learning environment" />
            <StatCard number="24/7" label="Remote access" />
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="mt-20 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get in touch with us. We're here to help bring NovaLabs to your school
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <a
            href="https://wa.me/256760245131"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:bg-green-100 hover:shadow-lg transition flex flex-col items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 mb-3 text-green-600"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.34 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.3a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1.01 2.56.14.17 1.75 2.67 4.23 3.74.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3 0-.47 0z" />
            </svg>
            <h3 className="font-bold text-lg text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-green-700 font-medium">Chat with us</p>
            <p className="text-sm text-gray-600 mt-1">+256 760 245 131</p>
          </a>
          <a
            href="https://www.linkedin.com/in/aturinda-treasure"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:bg-blue-100 hover:shadow-lg transition flex flex-col items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 mb-3 text-blue-700"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <h3 className="font-bold text-lg text-gray-900 mb-2">LinkedIn</h3>
            <p className="text-blue-700 font-medium">Contact us</p>
            <p className="text-sm text-gray-600 mt-1">Aturinda Treasure</p>
          </a>
          <a
            href="tel:+256784318635"
            className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center hover:bg-purple-100 hover:shadow-lg transition flex flex-col items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 mb-3 text-purple-600"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Phone Call</h3>
            <p className="text-purple-700 font-medium">Call us directly</p>
            <p className="text-sm text-gray-600 mt-1">+256 784 318 635</p>
          </a>
          <a
            href="mailto:aturindatreasure8@gmail.com"
            className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center hover:bg-red-100 hover:shadow-lg transition flex flex-col items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 mb-3 text-red-600"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
            <p className="text-red-700 font-medium">Email us</p>
            <p className="text-sm text-gray-600 mt-1">aturindatreasure8@gmail.com</p>
          </a>
        </div>
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-orange-600"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span className="font-medium text-orange-700">Offices are in KABALE</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Virtual Science Laboratory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function SubjectCard({
  subject,
  title,
  description,
  color,
}: {
  subject: Subject;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200`}>
      <SubjectIcon subject={subject} title={title} className="w-16 h-16 mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PartnerCard({
  logo,
  name,
  description,
  href,
}: {
  logo: string;
  name: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-20 w-40 items-center justify-center bg-white rounded-lg border border-gray-200 p-3">
        <img src={logo} alt={name} className="max-h-full max-w-full object-contain" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="text-sm leading-6 text-gray-600">{description}</p>
      <span className="text-sm font-medium text-blue-700 hover:text-blue-900">Visit website →</span>
    </a>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-200">{label}</div>
    </div>
  );
}
