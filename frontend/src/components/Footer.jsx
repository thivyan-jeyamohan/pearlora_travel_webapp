import React from 'react';
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="#" className="flex items-center">
              <img src={logo} className="h-8 me-3" alt="FlowBite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PEARLORA</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">{section.title}</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  {section.links.map((link) => (
                    <li className="mb-4" key={link.name}>
                      <a href={link.href} className="hover:underline">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 <a href="#" className="hover:underline">Pearlora</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {socialLinks.map((social) => (
              <a href={social.href} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5" key={social.name}>
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinks = [
  {
    title: 'Booking A',
    links: [
      { name: 'Destination', href: '#' },
      { name: 'Transport', href: '#' },
    ],
  },
  {
    title: 'Booking B',
    links: [
      { name: 'Hotel', href: '#' },
      { name: 'Event', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'About US', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
  },
];

const socialLinks = [
  { name: 'Facebook', href: '#', icon: <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 8 19"><path d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"/></svg> },
  { name: 'Twitter', href: '#', icon: <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 17"><path d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807 8.36 8.36 0 0 1-6.291 1.76 11.732 11.732 0 0 0 6.291 2.246 11.502 11.502 0 0 0 11.35-11.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"/></svg> }
];

export default Footer;