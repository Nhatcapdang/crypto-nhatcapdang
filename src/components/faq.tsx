"use client"

import { useState } from "react"
import { MessageCircle, ChevronDown } from "lucide-react"
import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormSeparator,
} from "./ui/popover-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { cn } from "@/lib/utils"

interface FormData {
  name: string
  email: string
  message: string
}

const faqQuestions = [
  {
    question:
      "Could you please provide details on the various types of accommodations available?",
    answer:
      "We offer a wide range of accommodations including hotels, vacation rentals, apartments, and unique stays. Each property is carefully vetted to ensure quality and comfort for all our guests.",
  },
  {
    question: "What is the process for making a booking?",
    answer:
      "Making a booking is simple! Browse through available properties, select your desired dates, review the details, and complete the secure payment process. You'll receive instant confirmation via email.",
  },
  {
    question:
      "Could you please provide details regarding your cancellation policy?",
    answer:
      "Our cancellation policy varies by property. Most bookings offer free cancellation up to 48 hours before check-in. Please review the specific cancellation terms during the booking process.",
  },
  {
    question:
      "Is it possible to modify my booking after it has been confirmed?",
    answer:
      "Yes, you can modify your booking subject to availability. Changes to dates, number of guests, or accommodation type can be made through your account dashboard or by contacting our support team.",
  },
  {
    question: "Are pets permitted in your accommodations?",
    answer:
      "Pet policies vary by property. Many of our accommodations are pet-friendly, while others have restrictions. Use our pet-friendly filter when searching to find suitable options for you and your furry friends.",
  },
]

export default function Faq() {
  const [open, setOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [openItems, setOpenItems] = useState<number[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => {
          setShowSuccess(false)
          setOpen(false)
        }, 3000)
      } else {
        console.error("Form submission failed")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="w-full py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Contact Form */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <MessageCircle className="h-12 w-12 text-primary" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Still have Questions?
              </h2>
              <p className="text-muted-foreground text-lg">
                Can&apos;t find the answer you&apos;re looking for? Our friendly customer
                support team is ready to help you.
              </p>
            </div>

            <PopoverForm
              open={open}
              setOpen={setOpen}
              showSuccess={showSuccess}
              title="Contact Us"
              width="400px"
              height="360px"
              showCloseButton={true}
              openChild={
                <form onSubmit={handleSubmit} className="flex flex-col p-4 h-full">
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
                        onChange={(e) =>
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
                        onChange={(e) =>
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
                        onChange={(e) =>
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
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Common Questions You Might Have
              </h2>
              <p className="text-muted-foreground text-lg">
                Use AI algorithms to give users some cool insights!
              </p>
            </div>

            <div className="space-y-3">
              {faqQuestions.map((item, index) => (
                <Collapsible
                  key={index}
                  open={openItems.includes(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <div className="border rounded-lg bg-card">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors">
                      <span className="font-medium pr-4">{item.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                          openItems.includes(index) && "rotate-180"
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 text-muted-foreground">
                      <div className="pt-2">{item.answer}</div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
