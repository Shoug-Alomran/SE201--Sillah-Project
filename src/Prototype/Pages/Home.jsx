import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Activity,
  Bell,
  BookOpen,
  MapPin,
  Pill,
  ArrowRight,
  Check,
  Stethoscope,
  Plus,
  Phone,
  Mail,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "./Home.css";

const features = [
  {
    icon: Users,
    title: "A fuller picture of your family",
    text: "Connect generations of health history in a family tree that grows with you.",
    label: "Family history",
  },
  {
    icon: Activity,
    title: "Make sense of the connections",
    text: "Explore potential hereditary heart health risks based on your family history.",
    label: "Health insights",
  },
  {
    icon: MapPin,
    title: "Turn awareness into action",
    text: "Find clinics and organize appointments for the next step in your care.",
    label: "Preventive care",
  },
];
const steps = [
  [
    "Make it yours",
    "Create your account and set up your personal health profile.",
  ],
  [
    "Connect your history",
    "Add family members and record the health details that matter.",
  ],
  [
    "Plan your next step",
    "Review your insights and discuss your care with your doctor.",
  ],
];

function ProductPreview() {
  return (
    <div className="sl-preview-wrap">
      <div
        className="sl-preview"
        aria-label="Illustrative preview of the Sillah dashboard"
      >
        <div className="sl-preview-bar">
          <span>
            <Heart size={18} /> Sillah
          </span>
          <span className="sl-demo-label">Product preview</span>
        </div>
        <div className="sl-preview-body">
          <div className="sl-preview-heading">
            <div>
              <span className="sl-overline">MY HEALTH OVERVIEW</span>
              <h2>
                A little clarity.
                <br />A healthier tomorrow.
              </h2>
            </div>
            <div className="sl-avatar">S</div>
          </div>
          <div className="sl-preview-stats">
            <div>
              <Users size={18} />
              <strong>Family history</strong>
              <span>Connected across generations</span>
            </div>
            <div>
              <Heart size={18} />
              <strong>Your care, together</strong>
              <span>One place for what matters</span>
            </div>
          </div>
          <div className="sl-tree-panel">
            <div className="sl-panel-heading">
              <strong>Your family circle</strong>
              <span>
                <Plus size={14} /> Family tree
              </span>
            </div>
            <div className="sl-tree">
              <div className="sl-tree-row">
                <div>
                  <span className="sl-person">A</span>
                  <small>Parent</small>
                </div>
                <div>
                  <span className="sl-person sl-person-alt">M</span>
                  <small>Parent</small>
                </div>
              </div>
              <div className="sl-tree-connector" />
              <div className="sl-tree-self">
                <span className="sl-person">S</span>
                <small>You</small>
              </div>
            </div>
          </div>
          <div className="sl-preview-note">
            <span className="sl-note-icon">
              <Bell size={18} />
            </span>
            <div>
              <strong>Small steps. Meaningful care.</strong>
              <p>Keep your health history up to date.</p>
            </div>
            <ArrowRight size={17} />
          </div>
        </div>
      </div>
      <div className="sl-floating-note">
        <span>
          <Check size={17} />
        </span>
        <div>
          <strong>Better connected.</strong>
          <small>Family health, all in one place.</small>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { currentUser } = useAuth();
  const destination = currentUser ? "/dashboard" : "/signup";
  const action = currentUser ? "Open dashboard" : "Get started";
  return (
    <div className="sl-home">
      <a className="sl-skip" href="#main-content">
        Skip to content
      </a>
      <header className="sl-header">
        <nav className="sl-nav sl-width" aria-label="Main navigation">
          <Link to="/" className="sl-brand" aria-label="Sillah home">
            <span className="sl-brand-mark">
              <Heart size={23} />
            </span>
            <strong>
              Sillah<span lang="ar">صلة</span>
            </strong>
          </Link>
          <div className="sl-nav-links">
            <a href="#features">Why Sillah</a>
            <a href="#how-it-works">How it works</a>
            <a href="#for-doctors">For doctors</a>
            <a href="#contact" className="sl-contact-button">
              Contact
            </a>
          </div>
          <div className="sl-nav-actions">
            {!currentUser && (
              <Link to="/login" className="sl-login">
                Log in
              </Link>
            )}
            <Link to={destination} className="sl-button sl-button-small">
              {action}
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>
      <main id="main-content">
        <section className="sl-hero sl-width">
          <div className="sl-hero-copy">
            <p className="sl-eyebrow">
              <span /> CONNECTED FAMILY HEALTH
            </p>
            <h1>
              Health runs
              <br />
              in the family.
              <br />
              <em>So does care.</em>
            </h1>
            <p className="sl-lead">
              Your family’s story can shape your health. Bring your history,
              insights, and everyday care together with Sillah.
            </p>
            <div className="sl-hero-actions">
              <Link to={destination} className="sl-button">
                {currentUser ? action : "Start your health story"}
                <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="sl-text-link">
                Discover how it works <ArrowRight size={16} />
              </a>
            </div>
            <p className="sl-hero-caption">
              Built around you. Connected to the people who matter.
            </p>
          </div>
          <ProductPreview />
        </section>
        <div className="sl-benefit-strip">
          <div className="sl-width">
            <span>
              <Users /> Family history
            </span>
            <span>
              <Activity /> Personal insights
            </span>
            <span>
              <Stethoscope /> Connected care
            </span>
            <span>
              <Heart /> Everyday wellbeing
            </span>
          </div>
        </div>
        <section className="sl-section sl-width" id="features">
          <div className="sl-section-heading">
            <div>
              <p className="sl-eyebrow">SEE THE BIGGER PICTURE</p>
              <h2>
                More connected history.
                <br />
                More informed care.
              </h2>
            </div>
            <p>
              From the details you record to the decisions you make, keep what
              matters close.
            </p>
          </div>
          <div className="sl-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="sl-feature" key={feature.label}>
                  <span className="sl-feature-icon">
                    <Icon size={24} />
                  </span>
                  <p className="sl-overline">{feature.label}</p>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              );
            })}
          </div>
          <div className="sl-tools">
            <p>And the support you need, day to day.</p>
            <span>
              <Pill size={18} /> Medication tracking
            </span>
            <span>
              <Bell size={18} /> Health alerts
            </span>
            <span>
              <BookOpen size={18} /> Awareness hub
            </span>
          </div>
        </section>
        <section className="sl-how" id="how-it-works">
          <div className="sl-width sl-section">
            <div className="sl-centered">
              <p className="sl-eyebrow">A SIMPLE PLACE TO START</p>
              <h2>Your next chapter starts here.</h2>
              <p>You don’t need every detail to take the first step.</p>
            </div>
            <div className="sl-steps">
              {steps.map(([title, description], index) => (
                <article key={title}>
                  <span className="sl-step-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="sl-section sl-width" id="for-doctors">
          <div className="sl-provider">
            <div className="sl-provider-art" aria-hidden="true">
              <div className="sl-provider-circle">
                <Stethoscope size={60} strokeWidth={1.3} />
              </div>
              <span className="sl-provider-tag">
                <Users size={17} /> A shared view of care
              </span>
            </div>
            <div>
              <p className="sl-eyebrow">FOR HEALTHCARE PROVIDERS</p>
              <h2>
                Understand the person.
                <br />
                Connect the history.
              </h2>
              <p>
                Bring patient records, family health insights, and appointments
                into one view. Sillah helps you stay connected to the people in
                your care.
              </p>
              <Link to={destination} className="sl-text-link">
                {currentUser
                  ? "Go to your dashboard"
                  : "Join as a healthcare provider"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section className="sl-closing sl-width">
          <div>
            <p className="sl-eyebrow">
              YOUR FAMILY. YOUR HEALTH. YOUR NEXT STEP.
            </p>
            <h2>
              A healthier connection
              <br />
              starts with you.
            </h2>
          </div>
          <Link to={destination} className="sl-button sl-button-light">
            {currentUser ? action : "Create your account"}
            <ArrowRight size={18} />
          </Link>
        </section>
        <section
          className="sl-contact sl-section sl-width"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div>
            <p className="sl-eyebrow">GET IN TOUCH</p>
            <h2 id="contact-title">Let’s connect.</h2>
            <p className="sl-contact-intro">
              Have a question about Sillah? Get in touch by phone or email.
            </p>
          </div>
          <address className="sl-contact-details">
            <a href="tel:+966531007472">
              <span className="sl-contact-icon">
                <Phone size={21} aria-hidden="true" />
              </span>
              <span>
                <small>Phone</small>
                <strong dir="ltr">0531007472</strong>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="mailto:shoug.alomran@shoug-tech.com">
              <span className="sl-contact-icon">
                <Mail size={21} aria-hidden="true" />
              </span>
              <span>
                <small>Email</small>
                <strong>shoug.alomran@shoug-tech.com</strong>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </address>
        </section>
      </main>
      <footer className="sl-footer sl-width">
        <div className="sl-footer-top">
          <div>
            <Link to="/" className="sl-brand">
              <span className="sl-brand-mark">
                <Heart size={23} />
              </span>
              <strong>
                Sillah<span lang="ar">صلة</span>
              </strong>
            </Link>
            <p>Connected by family. Informed by history.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#contact">Contact</a>
            <a href="#features">Why Sillah</a>
            <a href="#how-it-works">How it works</a>
            <Link to={currentUser ? "/dashboard" : "/login"}>
              {currentUser ? "Dashboard" : "Log in"}
            </Link>
          </nav>
        </div>
        <div className="sl-footer-bottom">
          <span>© {new Date().getFullYear()} Sillah. All rights reserved.</span>
          <span>صلة — connection at the heart of care.</span>
        </div>
      </footer>
    </div>
  );
}
