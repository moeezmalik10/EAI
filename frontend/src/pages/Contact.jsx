import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHero from '../components/PageHero.jsx';
import FadeIn from '../components/FadeIn.jsx';

const CONTACT_EMAIL = 'noman.mazher@gmail.com';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.message.trim()) next.message = 'Please enter a message.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const subject = form.subject.trim() || `Message from ${form.name.trim()}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    toast.success('Opening your email client to send the message…');
    setForm(INITIAL_FORM);
  };

  return (
    <div>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you." />

      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FadeIn>
            <div className="card p-6">
              <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">Editorial Office</h3>
              <p className="text-sm text-navy-600">
                Euro Vantage Journal of Artificial Intelligence
                <br />
                Chief Editor: Dr. Hafsa Shareef Dar
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="card p-6">
              <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">Email</h3>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-navy-600 hover:text-gold-500">
                {CONTACT_EMAIL}
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={140}>
            <div className="card p-6">
              <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">Phone</h3>
              <p className="text-sm text-navy-600">3016258369</p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="card p-6">
              <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">Location</h3>
              <p className="text-sm text-navy-600">Gujrat, Pakistan</p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={240}>
          <div className="mx-auto mt-12 max-w-2xl">
            <h2 className="section-title mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Your Name *" error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass(errors.name)}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Your Email *" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass(errors.email)}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <Field label="Subject" hint="Optional.">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={inputClass()}
                  placeholder="e.g. Question about submissions"
                />
              </Field>

              <Field label="Message *" error={errors.message}>
                <textarea
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className={inputClass(errors.message)}
                  placeholder="How can we help?"
                />
              </Field>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                Send Message
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-md border px-3 py-2 text-sm text-navy-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400 ${
    error ? 'border-red-400' : 'border-navy-200'
  }`;
}
