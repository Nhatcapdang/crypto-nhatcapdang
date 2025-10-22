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

const faqFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const faqQuestions = [
  {
    question: 'What can I do with my meme coin?',
    answer:
      'Your meme coin can be used in multiple ways: trade it on decentralized exchanges (DEX), hold it as an investment, send it to other wallets, provide liquidity to earn rewards, participate in community governance if enabled, or use it within specific platforms that accept your token.',
  },
  {
    question: 'Where is my meme token listed and how can I view it?',
    answer:
      'Your meme token is listed on the Solana blockchain and can be viewed through blockchain explorers like Solscan or Solana Explorer. Once created, you can also list it on decentralized exchanges like Raydium or Jupiter, and track its performance on platforms like DexScreener or Birdeye.',
  },
  {
    question: 'Can I send my meme tokens to other wallets?',
    answer:
      "Yes! You can easily send your meme tokens to any Solana-compatible wallet address. Simply use your wallet (like Phantom or Solflare), enter the recipient's wallet address, specify the amount of tokens you want to send, and confirm the transaction. A small SOL fee will be required for the transaction.",
  },
  {
    question: 'How do I swap my meme tokens for other cryptocurrencies?',
    answer:
      'You can swap your meme tokens using decentralized exchanges (DEX) on Solana such as Jupiter, Raydium, or Orca. Connect your wallet, select your meme token and the cryptocurrency you want to receive, enter the amount, review the exchange rate and fees, then confirm the swap. Ensure you have some SOL for transaction fees.',
  },
  {
    question:
      'Can I transfer my tokens between different wallets and what are the requirements?',
    answer:
      "Yes, you can transfer your meme tokens between any Solana-compatible wallets. You'll need the recipient wallet address, sufficient tokens to transfer, and a small amount of SOL (typically 0.000005 SOL) to cover the network transaction fee. Transfers are typically completed within seconds on the Solana network.",
  },
];

export default function Faq() {
  const [opened, handlers] = useDisclosure(false);

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
  console.log('field errors', formFaq.state.errors);
  return (
    <section
      id="faq-section"
      className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 grid-cols-12 lg:gap-12">
          {/* Left Side - Contact Form */}
          <div className="lg:col-span-6 md:col-span-5 col-span-12 flex flex-col justify-center space-y-6 md:space-y-8">
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
              height="470px"
              width="400px"
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
                            field.state.meta.errors[0]?.message || undefined
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
                            field.state.meta.errors[0]?.message || undefined
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
                          <div className="relative">
                            <Textarea
                              disableAnimations
                              label={
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  Message
                                </div>
                              }
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={() => field.handleBlur()}
                              onChange={e => field.handleChange(e.target.value)}
                              placeholder="How can we help you?"
                              rows={4}
                              error={
                                field.state.meta.errors[0]?.message || undefined
                              }
                              isInvalid={field.state.meta.errors.length > 0}
                            />
                          </div>
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
          <div className="lg:col-span-6 md:col-span-7 col-span-12 flex flex-col space-y-6 md:space-y-8">
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
