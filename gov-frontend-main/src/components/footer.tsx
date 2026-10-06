
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Logo } from './logo';
import { departments } from '@/lib/data';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const footerLinks = [
    {
      title: 'About GovConnect',
      links: [
        { label: 'Our Mission', href: '#' },
        { label: 'Official Team', href: '#' },
        { label: 'Digital India', href: '#' },
      ],
    },
    {
      title: 'Quick Access',
      links: [
        { label: 'Public Services', href: '/services' },
        { label: 'Official Dashboard', href: '/app/dashboard' },
        { label: 'Document Vault', href: '/app/documents' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Desk', href: '#' },
        { label: 'Press Releases', href: '#' },
        { label: 'Public Feedback', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Audit Log Policy', href: '#' },
      ],
    },
  ];

  const featuredDepartments = departments.slice(0, 7);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-6">
          <div className="md:col-span-3 lg:col-span-2 space-y-6">
            <Logo className="text-white" />
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
              GovConnect is the official unified platform connecting government departments and citizens of India efficiently, streamlining digital governance.
            </p>
            <div className="pt-4 flex gap-4">
               <div className="w-10 h-1 rounded-full bg-accent" />
               <div className="w-4 h-1 rounded-full bg-accent/50" />
            </div>
          </div>
          
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-accent mb-8">
              Departments
            </h3>
            <ul className="space-y-4">
              {featuredDepartments.map((dept) => (
                <li key={dept.name}>
                  <Link
                    href="/services"
                    className="text-sm text-primary-foreground/70 hover:text-white transition-colors"
                  >
                    {dept.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm font-bold text-accent hover:underline"
                >
                  View All +
                </Link>
              </li>
            </ul>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="md:col-span-1">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-accent mb-8">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-primary-foreground/50">
            &copy; {year} GovConnect. An initiative for Digital India. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-semibold text-primary-foreground/40 hover:text-white uppercase tracking-widest">Twitter</Link>
            <Link href="#" className="text-xs font-semibold text-primary-foreground/40 hover:text-white uppercase tracking-widest">LinkedIn</Link>
            <Link href="#" className="text-xs font-semibold text-primary-foreground/40 hover:text-white uppercase tracking-widest">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
