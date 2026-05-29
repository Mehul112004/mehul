import { useState } from 'react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — wire up to a backend or email service in production
  };

  return (
    <section className="mb-section">
      <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-on-surface-variant">
        Contact
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-xl space-y-8"
      >
        <div>
          <label
            htmlFor="name"
            className="block font-mono text-sm text-on-surface-variant"
          >
            const userName =
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="mt-2 w-full border-b border-outline bg-transparent py-2 font-sans text-on-surface placeholder:text-on-surface-variant/40 focus:border-b-2 focus:border-primary focus:outline-none"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-mono text-sm text-on-surface-variant"
          >
            const userEmail =
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="mt-2 w-full border-b border-outline bg-transparent py-2 font-sans text-on-surface placeholder:text-on-surface-variant/40 focus:border-b-2 focus:border-primary focus:outline-none"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block font-mono text-sm text-on-surface-variant"
          >
            const message =
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            className="mt-2 w-full resize-none border-b border-outline bg-transparent py-2 font-sans text-on-surface placeholder:text-on-surface-variant/40 focus:border-b-2 focus:border-primary focus:outline-none"
            placeholder="Hello, I'd like to talk about..."
          />
        </div>

        <button
          type="submit"
          className="rounded-sm bg-primary px-6 py-2.5 font-sans font-medium text-[#002e6a] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
