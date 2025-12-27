'use client';

import { FormInput, FormTextarea } from '@/components/form';
import { useFeedBackMutation } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@mantine/hooks';
import { Mail, MessageCircle, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormSeparator,
} from './ui/popover-form';

const faqFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Faq() {
  const [opened, handlers] = useDisclosure(false);
  const t = useTranslations('faq');
  const faqQuestions = t.raw('faq_question') as {
    question: string;
    answer: string;
  }[];
  const { mutateAsync: sendFeedBackAsync, isPending } = useFeedBackMutation();
  const formFaq = useForm<z.infer<typeof faqFormSchema>>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(data: z.infer<typeof faqFormSchema>) {
    sendFeedBackAsync(data, {
      onSuccess: () => {
        handlers.toggle();
        formFaq.reset();
      },
    });
  }

  return (
    <section
      id="faq-section"
      className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="container relative z-10 ">
        <div className="grid gap-8 grid-cols-12 lg:gap-12">
          {/* Left Side - Contact Form */}
          <div className="lg:col-span-6 md:col-span-5 col-span-12 flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <MessageCircle className="size-4" />
                <span>{t('need_help')}</span>
              </div>
              <h2
                id="faq-heading"
                className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
              >
                {t('still_have_questions')}{' '}
                <span className="text-linear-gradient">
                  {t('still_have_questions_highlight')}
                </span>
              </h2>
              <p className="text-base text-muted-foreground md:text-lg lg:text-xl">
                {t('cant_find_answer')}
              </p>
            </div>

            <PopoverForm
              open={opened}
              setOpen={handlers.toggle}
              showSuccess={false}
              title={t('contact_support_team')}
              height="470px"
              width="400px"
              showCloseButton={true}
              openChild={
                <form
                  onSubmit={formFaq.handleSubmit(onSubmit)}
                  className="flex flex-col p-4 h-full"
                  noValidate
                >
                  <div className="flex-1 space-y-3 mt-8">
                    <FormInput
                      control={formFaq.control}
                      name="name"
                      label={t('name')}
                      type="text"
                      placeholder="John Doe"
                      rightIcon={<User className="w-4 h-4" />}
                    />

                    <FormInput
                      control={formFaq.control}
                      name="email"
                      label={t('email')}
                      type="email"
                      placeholder="john.doe@example.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                    />

                    <FormTextarea
                      control={formFaq.control}
                      name="message"
                      label={t('message')}
                      placeholder={t('how_can_we_help_you')}
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t relative mt-3">
                    <PopoverFormSeparator />
                    <span className="text-xs text-muted-foreground">
                      {t('we_will_respond_within_24_hours')}
                    </span>
                    <PopoverFormButton loading={isPending} text="Send" />
                  </div>
                </form>
              }
            />
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="lg:col-span-6 md:col-span-7 col-span-12 flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl lg:text-4xl">
                {t('common_questions_you_might_have')}
              </h3>
              <p className="text-base text-muted-foreground md:text-lg">
                {t('common_questions_you_might_have_description')}
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
    </section>
  );
}
