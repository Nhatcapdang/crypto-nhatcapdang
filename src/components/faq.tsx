'use client';

import { MessageCircle, User, Mail, MessageSquare } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormSeparator,
} from './ui/popover-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { useDisclosure } from '@mantine/hooks';
import { InputWithAdornments } from './input-with-adornments';
import { Textarea } from './ui';

// Zod schema for contact form validation
const faqFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must not exceed 500 characters'),
});

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
  const [opened, handlers] = useDisclosure(false);

  // Initialize TanStack Form with Zod validation
  const formFaq = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    validators: {
      onSubmit: faqFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 grid-cols-12 lg:gap-12">
          {/* Left Side - Contact Form */}
          <div className="lg:col-span-6 md:col-span-4 col-span-12 flex flex-col justify-center space-y-6 md:space-y-8">
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
              open={opened}
              setOpen={handlers.toggle}
              showSuccess={false}
              title="Contact Support Team"
              height="460px"
              width="420px"
              showCloseButton={true}
              openChild={
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    formFaq.handleSubmit();
                  }}
                  className="flex flex-col p-4 h-full"
                >
                  <div className="flex-1 space-y-3 mt-8 overflow-y-auto">
                    {/* Name Field */}
                    <formFaq.Field name="name">
                      {field => (
                        <InputWithAdornments
                          id={field.name}
                          name={field.name}
                          type="text"
                          label="Name"
                          placeholder="John Doe"
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          leftAdornment={<User className="w-4 h-4" />}
                          clearable
                          disableAnimations
                          size="lg"
                          error={
                            field.state.meta.errors.length > 0
                              ? typeof field.state.meta.errors[0] === 'string'
                                ? field.state.meta.errors[0]
                                : 'Invalid value'
                              : undefined
                          }
                          isInvalid={field.state.meta.errors.length > 0}
                          fieldClassName="space-y-1"
                        />
                      )}
                    </formFaq.Field>

                    {/* Email Field */}
                    <formFaq.Field name="email">
                      {field => (
                        <InputWithAdornments
                          id={field.name}
                          name={field.name}
                          type="email"
                          label="Email"
                          placeholder="john.doe@example.com"
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          leftAdornment={<Mail className="w-4 h-4" />}
                          clearable
                          disableAnimations
                          size="lg"
                          error={
                            field.state.meta.errors.length > 0
                              ? typeof field.state.meta.errors[0] === 'string'
                                ? field.state.meta.errors[0]
                                : 'Invalid value'
                              : undefined
                          }
                          isInvalid={field.state.meta.errors.length > 0}
                          fieldClassName="space-y-1"
                        />
                      )}
                    </formFaq.Field>

                    {/* Message Field */}
                    <formFaq.Field name="message">
                      {field => (
                        <div className="space-y-2">
                          <label
                            htmlFor={field.name}
                            className="flex items-center gap-2 text-sm leading-none font-medium select-none"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Message <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <Textarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={() => field.handleBlur()}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="How can we help you?"
                              rows={4}
                              aria-invalid={field.state.meta.errors.length > 0}
                              aria-describedby={
                                field.state.meta.errors.length > 0
                                  ? `${field.name}-error`
                                  : undefined
                              }
                            />
                          </div>
                          {field.state.meta.errors.length > 0 && (
                            <div
                              id={`${field.name}-error`}
                              className="text-destructive text-sm font-normal"
                              role="alert"
                            >
                              {field.state.meta.errors.length > 0
                                ? typeof field.state.meta.errors[0] === 'string'
                                  ? field.state.meta.errors[0]
                                  : 'Invalid value'
                                : undefined}
                            </div>
                          )}
                        </div>
                      )}
                    </formFaq.Field>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t relative mt-auto">
                    <PopoverFormSeparator />
                    <span className="text-xs text-muted-foreground">
                      We&apos;ll respond within 24 hours
                    </span>
                    <formFaq.Subscribe
                      selector={state => [state.canSubmit, state.isSubmitting]}
                    >
                      {() => <PopoverFormButton loading={false} text="Send" />}
                    </formFaq.Subscribe>
                  </div>
                </form>
              }
            />
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="lg:col-span-6 md:col-span-8 col-span-12 flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl lg:text-4xl">
                Common Questions You Might Have
              </h3>
              <p className="text-base text-muted-foreground md:text-lg">
                Find quick answers to frequently asked questions about our
                platform.
              </p>
            </div>

            <Accordion type="multiple" className="space-y-3">
              {faqQuestions.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80 border-b-0"
                >
                  <AccordionTrigger className="px-4 py-4 text-left font-semibold text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground">
                    <div className="pt-2 border-t border-border">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
