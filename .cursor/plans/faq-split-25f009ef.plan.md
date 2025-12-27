---
name: FAQ Split Layout Component
overview: ""
todos:
  - id: de6a16ad-53e0-4c17-a3e8-5f50bc0e414e
    content: Install resend package for email functionality
    status: pending
  - id: 4da77108-b695-4a09-8980-e1f4ad0a15a5
    content: Create API route at src/app/api/contact/route.ts with Resend integration
    status: pending
  - id: 261ec9d9-5dab-403b-9157-dc3ed470b414
    content: Build FAQ component with split layout, contact form (left) and accordion questions (right)
    status: pending
  - id: 7af84901-99aa-4686-add9-fd7bbc1273b1
    content: Implement responsive design with mobile-first Tailwind breakpoints
    status: pending
  - id: fe12ff36-5270-4ec7-8794-ad009bb5b1dd
    content: Export FAQ component from components index file
    status: pending
---

# FAQ Split Layout Component

## 1. Install Resend Package

Add by using yarn `resend` package to dependencies for email functionality.

## 2. Create API Route for Contact Form

**File**: `src/app/api/contact/route.ts`

- Create POST endpoint to handle form submissions
- Integrate Resend API to send emails
- Use environment variable for API key (`RESEND_API_KEY`)
- Return success/error responses
- Handle validation

## 3. Build FAQ Component

**File**: `src/components/faq.tsx`

- Split layout using CSS Grid (responsive: stack on mobile, side-by-side on desktop)
- **Left side**: Contact form section
- Use `PopoverForm` component from `ui/popover-form.tsx`
- Form fields: Name, Email, Message
- Submit button with loading state
- Success state after submission
- Text: "Still have Questions?" with supporting copy
- Icon: Chat/message icon from lucide-react
- **Right side**: FAQ accordion section
- Title: "Common Questions You Might Have"
- Subtitle: "Use AI algorithms to give users some cool insights!"
- 5 token/crypto-related questions using `Collapsible` component
- Questions:

1. "Could you please provide details on the various types of accommodations available?"
2. "What is the process for making a booking?"
3. "Could you please provide details regarding your cancellation policy?"
4. "Is it possible to modify my booking after it has been confirmed?"
5. "Are pets permitted in your accommodations?"

- Chevron icons for expand/collapse
- Smooth animations

## 4. Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Stack layout vertically on mobile (< 768px)
- Side-by-side layout on tablet/desktop (≥ 768px)
- Responsive typography and spacing
- Proper touch targets for mobile

## 5. Optimizations

- Use React.memo if needed
- Proper TypeScript types for form data
- Accessibility: ARIA labels, keyboard navigation
- Form validation before submission

## 6. Integration