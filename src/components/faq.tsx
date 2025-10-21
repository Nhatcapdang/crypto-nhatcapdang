'use client';

import { useState } from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormSeparator,
} from './ui/popover-form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const faqQuestions = [
  {
    question:
      'Could you please provide details on the various types of accommodations available?',
    answer:
      'We offer a wide range of accommodations including hotels, vacation rentals, apartments, and unique stays. Each property is carefully vetted to ensure quality and comfort for all our guests.',
  },
  {
    question: 'What is the process for making a booking?',
    answer:
      "Making a booking is simple! Browse through available properties, select your desired dates, review the details, and complete the secure payment process. You'll receive instant confirmation via email.",
  },
  {
    question:
      'Could you please provide details regarding your cancellation policy?',
    answer:
      'Our cancellation policy varies by property. Most bookings offer free cancellation up to 48 hours before check-in. Please review the specific cancellation terms during the booking process.',
  },
  {
    question:
      'Is it possible to modify my booking after it has been confirmed?',
    answer:
      'Yes, you can modify your booking subject to availability. Changes to dates, number of guests, or accommodation type can be made through your account dashboard or by contacting our support team.',
  },
  {
    question: 'Are pets permitted in your accommodations?',
    answer:
      'Pet policies vary by property. Many of our accommodations are pet-friendly, while others have restrictions. Use our pet-friendly filter when searching to find suitable options for you and your furry friends.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [openItems, setOpenItems] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setShowSuccess(false);
          setOpen(false);
        }, 3000);
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Contact Form */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <MessageCircle className="size-4" />
                <span>NEED HELP?</span>
              </div>
              <h2
                id="faq-heading"
                className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
              >
                Still have{' '}
                <span className="text-linear-gradient">Questions?</span>
              </h2>
              <p className="text-base text-muted-foreground md:text-lg lg:text-xl">
                Can&apos;t find the answer you&apos;re looking for? Our friendly
                customer support team is ready to help you.
              </p>
            </div>

            <PopoverForm
              open={open}
              setOpen={setOpen}
              showSuccess={showSuccess}
              title="Contact Support Team"
              width="400px"
              height="360px"
              showCloseButton={true}
              openChild={
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col p-4 h-full"
                >
                  <div className="flex-1 space-y-3 mt-8">
                    <div className="space-y-1">
                      <label
                        htmlFor="name"
                        className="text-xs text-muted-foreground"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="text-xs text-muted-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="message"
                        className="text-xs text-muted-foreground"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={e =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                        placeholder="How can we help you?"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t relative">
                    <PopoverFormSeparator />
                    <span className="text-xs text-muted-foreground">
                      We&apos;ll respond within 24 hours
                    </span>
                    <PopoverFormButton loading={loading} text="Send" />
                  </div>
                </form>
              }
            />
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl lg:text-4xl">
                Common Questions You Might Have
              </h3>
              <p className="text-base text-muted-foreground md:text-lg">
                Find quick answers to frequently asked questions about our
                platform.
              </p>
            </div>

            <div className="space-y-3">
              {faqQuestions.map((item, index) => (
                <Collapsible
                  key={index}
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left transition-colors">
                      <span className="font-semibold pr-4 text-foreground">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 shrink-0 text-primary transition-transform duration-200',
                          openItems.includes(index) && 'rotate-180'
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 text-muted-foreground">
                      <div className="pt-2 border-t border-border/30">
                        {item.answer}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"
        aria-hidden="true"
      />
    </section>
  );
}
