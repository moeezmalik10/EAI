import { useState } from 'react';
import toast from 'react-hot-toast';
import { endpoints } from '../api/client.js';
import PageHero from '../components/PageHero.jsx';
import FadeIn from '../components/FadeIn.jsx';

const INITIAL_FORM = {
  title: '',
  abstract: '',
  authors: '',
  keywords: '',
  correspondingEmail: '',
};

const MAX_FILE_MB = 20;

export default function SubmitPaper() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.abstract.trim() || form.abstract.trim().length < 50)
      next.abstract = 'Abstract must be at least 50 characters.';
    if (!form.authors.trim()) next.authors = 'Please list at least one author.';
    if (!form.correspondingEmail.trim()) {
      next.correspondingEmail = 'Corresponding author email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correspondingEmail.trim())) {
      next.correspondingEmail = 'Enter a valid email address.';
    }
    if (file && file.size > MAX_FILE_MB * 1024 * 1024) {
      next.file = `File must be smaller than ${MAX_FILE_MB} MB.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (file) formData.append('manuscriptFile', file);

      await endpoints.submit(formData);
      toast.success('Manuscript submitted successfully! We will contact you soon.');
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        title="Submit a Paper"
        subtitle="Share your research with a global AI community. Fields marked * are required."
      />

      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl">
          {submitted && (
            <FadeIn className="mb-8 rounded-md border border-teal-200 bg-teal-50 px-5 py-4 text-teal-800">
              Thank you — your manuscript has been received. Our editorial team will review it and
              reach out to the corresponding author with next steps.
            </FadeIn>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <Field label="Manuscript Title *" error={errors.title}>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass(errors.title)}
                placeholder="e.g. Transformer-Based Approaches to Low-Resource NLP"
              />
            </Field>

            <Field label="Abstract *" error={errors.abstract} hint="Minimum 50 characters.">
              <textarea
                name="abstract"
                rows={6}
                value={form.abstract}
                onChange={handleChange}
                className={inputClass(errors.abstract)}
                placeholder="Summarize your research objectives, methodology, and key findings…"
              />
            </Field>

            <Field label="Authors *" error={errors.authors} hint="Full names, separated by commas.">
              <input
                type="text"
                name="authors"
                value={form.authors}
                onChange={handleChange}
                className={inputClass(errors.authors)}
                placeholder="e.g. Jane Doe, John Smith"
              />
            </Field>

            <Field label="Keywords" hint="Comma-separated (optional).">
              <input
                type="text"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                className={inputClass()}
                placeholder="e.g. machine learning, NLP, transformers"
              />
            </Field>

            <Field label="Corresponding Author Email *" error={errors.correspondingEmail}>
              <input
                type="email"
                name="correspondingEmail"
                value={form.correspondingEmail}
                onChange={handleChange}
                className={inputClass(errors.correspondingEmail)}
                placeholder="you@institution.edu"
              />
            </Field>

            <Field label="Manuscript File" error={errors.file} hint="PDF or Word, up to 20 MB (optional for this prototype).">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-navy-600 file:mr-4 file:rounded-md file:border-0 file:bg-navy-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
              />
              {file && <p className="mt-1 text-xs text-navy-500">Selected: {file.name}</p>}
            </Field>

            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? 'Submitting…' : 'Submit Manuscript'}
            </button>
          </form>
        </div>
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
