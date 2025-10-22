'use client';

import * as React from 'react';
import {
  MailIcon,
  SearchIcon,
  UserIcon,
  LockIcon,
  DollarSignIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
} from 'lucide-react';

import { InputWithAdornments } from '.';

/**
 * Comprehensive examples demonstrating all InputWithAdornments features
 */
export function InputWithAdornmentsExamples() {
  const [email, setEmail] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [phone, setPhone] = React.useState('');

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">InputWithAdornments Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive showcase of all features, variants, and use cases.
        </p>
      </div>

      {/* Basic Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Basic Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithAdornments
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftAdornment={<MailIcon className="w-4 h-4" />}
            clearable
            helperText="We'll never share your email with anyone"
          />

          <InputWithAdornments
            label="Search"
            placeholder="Search campaigns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftAdornment={<SearchIcon className="w-4 h-4" />}
            clearable
          />
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Size Variants</h2>

        <div className="space-y-4">
          <InputWithAdornments
            size="xs"
            label="Extra Small (xs)"
            placeholder="Extra small input"
            leftAdornment={<UserIcon className="w-3 h-3" />}
            clearable
          />

          <InputWithAdornments
            size="sm"
            label="Small (sm)"
            placeholder="Small input"
            leftAdornment={<UserIcon className="w-3.5 h-3.5" />}
            clearable
          />

          <InputWithAdornments
            size="md"
            label="Medium (md) - Default"
            placeholder="Medium input"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
          />

          <InputWithAdornments
            size="lg"
            label="Large (lg)"
            placeholder="Large input"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
          />

          <InputWithAdornments
            size="xl"
            label="Extra Large (xl)"
            placeholder="Extra large input"
            leftAdornment={<UserIcon className="w-5 h-5" />}
            clearable
          />
        </div>
      </section>

      {/* Radius Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Radius Variants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputWithAdornments
            radius="none"
            label="No Radius"
            placeholder="Sharp corners"
            leftAdornment={<UserIcon className="w-4 h-4" />}
          />

          <InputWithAdornments
            radius="sm"
            label="Small Radius"
            placeholder="Small rounded"
            leftAdornment={<UserIcon className="w-4 h-4" />}
          />

          <InputWithAdornments
            radius="md"
            label="Medium Radius"
            placeholder="Medium rounded"
            leftAdornment={<UserIcon className="w-4 h-4" />}
          />

          <InputWithAdornments
            radius="lg"
            label="Large Radius"
            placeholder="Large rounded"
            leftAdornment={<UserIcon className="w-4 h-4" />}
          />

          <InputWithAdornments
            radius="xl"
            label="Extra Large Radius"
            placeholder="Extra rounded"
            leftAdornment={<UserIcon className="w-4 h-4" />}
          />

          <InputWithAdornments
            radius="full"
            label="Full Radius"
            placeholder="Fully rounded"
            leftAdornment={<UserIcon className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Fill Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Fill Variants</h2>

        <div className="space-y-4">
          <InputWithAdornments
            variant="outline"
            label="Outline (Default)"
            placeholder="Outline variant"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
            helperText="Default outline style with border"
          />

          <InputWithAdornments
            variant="filled"
            label="Filled"
            placeholder="Filled variant"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
            helperText="Filled background style"
          />

          <InputWithAdornments
            variant="ghost"
            label="Ghost"
            placeholder="Ghost variant"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
            helperText="Minimal ghost style"
          />
        </div>
      </section>

      {/* States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">States</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithAdornments
            label="Normal State"
            placeholder="Normal input"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
            helperText="This is a normal input field"
          />

          <InputWithAdornments
            label="Disabled State"
            placeholder="Disabled input"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            disabled
            helperText="This input is disabled"
          />

          <InputWithAdornments
            label="Error State"
            placeholder="Input with error"
            leftAdornment={<MailIcon className="w-4 h-4" />}
            error="Please enter a valid email address"
            clearable
          />

          <InputWithAdornments
            label="Multiple Errors"
            placeholder="Input with multiple errors"
            leftAdornment={<LockIcon className="w-4 h-4" />}
            error={[
              'Password must be at least 8 characters',
              'Password must contain at least one number',
              'Password must contain at least one special character',
            ]}
          />
        </div>
      </section>

      {/* Advanced Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Advanced Examples</h2>

        <div className="space-y-6">
          {/* Password with right adornment */}
          <InputWithAdornments
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftAdornment={<LockIcon className="w-4 h-4" />}
            rightAdornment={
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Show
              </button>
            }
            helperText="Must be at least 8 characters"
          />

          {/* Amount with currency */}
          <InputWithAdornments
            type="number"
            label="Funding Goal"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            leftAdornment={<DollarSignIcon className="w-4 h-4" />}
            rightAdornment={
              <span className="text-sm text-muted-foreground">USD</span>
            }
            clearable
            helperText="Enter your campaign funding goal"
          />

          {/* Phone with formatting */}
          <InputWithAdornments
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            leftAdornment={<PhoneIcon className="w-4 h-4" />}
            clearable
            helperText="Include country code for international numbers"
          />

          {/* Date picker style */}
          <InputWithAdornments
            type="date"
            label="Campaign End Date"
            leftAdornment={<CalendarIcon className="w-4 h-4" />}
            helperText="Select when your campaign should end"
          />

          {/* Location */}
          <InputWithAdornments
            label="Location"
            placeholder="Enter city or address"
            leftAdornment={<MapPinIcon className="w-4 h-4" />}
            rightAdornment={
              <button
                type="button"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Detect
              </button>
            }
            clearable
            helperText="Help backers find local campaigns"
          />
        </div>
      </section>

      {/* Custom Styling */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Custom Styling</h2>

        <div className="space-y-4">
          <InputWithAdornments
            label="Custom Colors"
            placeholder="Custom styled input"
            leftAdornment={<SearchIcon className="w-4 h-4 text-primary" />}
            clearable
            groupClassName="border-primary/50 focus-within:border-primary focus-within:ring-primary/20"
            helperText="Custom border and focus colors"
          />

          <InputWithAdornments
            size="lg"
            radius="full"
            variant="filled"
            label="Large Filled Pill"
            placeholder="Large filled input with full radius"
            leftAdornment={<UserIcon className="w-5 h-5" />}
            clearable
            helperText="Combination of large size, filled variant, and full radius"
          />
        </div>
      </section>

      {/* Animation Controls */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Animation Controls</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithAdornments
            label="With Animations (Default)"
            placeholder="Animated input"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
            helperText="Includes focus scaling and clear button animations"
          />

          <InputWithAdornments
            label="Without Animations"
            placeholder="Static input"
            leftAdornment={<UserIcon className="w-4 h-4" />}
            clearable
            disableAnimations
            helperText="Animations disabled for reduced motion preference"
          />
        </div>
      </section>
    </div>
  );
}

export default InputWithAdornmentsExamples;
