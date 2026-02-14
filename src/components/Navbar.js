'use client';
import Link from 'next/link'
import Image from 'next/image'
import posthog from 'posthog-js';

const Navbar = () => {
    const handleNavClick = (linkText, destination) => {
        posthog.capture('nav_link_clicked', {
            link_text: linkText,
            destination: destination,
        });
    };

    return (
        <header>
            <nav>
                <Link href='/' className='logo' onClick={() => handleNavClick('DevEvent Logo', '/')}>
                    <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
                    <p>DevEvent</p>
                </Link>

                <ul className='list-none'>
                    <li><Link href="/" onClick={() => handleNavClick('Home', '/')}>Home</Link></li>
                    <li><Link href="/" onClick={() => handleNavClick('Events', '/')}>Events</Link></li>
                    <li><Link href="/" onClick={() => handleNavClick('Create Event', '/')}>Create Event</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
