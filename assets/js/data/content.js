export const content = {
    navigation: {
        left: [
            { label: 'Career', href: '#career' },
            { label: 'Projects', href: '#projects' },
            { label: 'Organizations', href: '#' },
            {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/jzheng39/',
                target: '_blank',
                rel: 'noopener noreferrer',
            },
            {
                label: 'GitHub',
                href: 'https://github.com/M1ght1203',
                target: '_blank',
                rel: 'noopener noreferrer',
            },
        ],
        right: {
            label: 'Resume',
            href: 'resume/resume.pdf',
            target: '_blank',
            download: true,
        },
        mobile: [
            { label: 'Career', href: '#career' },
            { label: 'Projects', href: '#projects' },
            { label: 'Organizations', href: '#' },
            {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/jzheng39/',
                target: '_blank',
                rel: 'noopener noreferrer',
            },
            {
                label: 'GitHub',
                href: 'https://github.com/M1ght1203',
                target: '_blank',
                rel: 'noopener noreferrer',
            },
            {
                label: 'Resume',
                href: 'resume/resume.pdf',
                target: '_blank',
                download: true,
                classNames: ['mobile-resume'],
            },
        ],
    },
    hero: {
        id: 'hero',
        title: 'Jason Zheng',
        subtitle: 'Software Engineer',
        video: {
            src: 'https://www.youtube.com/embed/qol_gS1txGs?autoplay=1&mute=1&controls=0&loop=1&playlist=qol_gS1txGs&modestbranding=1&playsinline=1&rel=0',
            title: 'Landing page background video',
            allow: 'autoplay; fullscreen; picture-in-picture',
            fallback: 'assets/images/hero-fallback.jpg',
            alt: 'Abstract dark gradient background',
        },
    },
    sections: [
        {
            type: 'timeline',
            id: 'career',
            title: 'Career',
            entries: [
                {
                    date: 'May 2025 – Jul 2025',
                    role: 'Software Engineer Intern',
                    company: 'L3Harris',
                    link: 'https://l3harris.com',
                    description:
                        'At L3Harris, I designed and developed an internal Configure, Price, Quote (CPQ) tool to streamline the quoting process and enhance pricing accuracy. The system allows users to add and manage products with tiered pricing based on quantity, create and track multiple price versions over time with full historical visibility, and define complex discounting rules. It supports multiple product families, customizable configurations, and robust quote management workflows. Built on a SQL database with role-based security, the tool ensures data integrity and access control while providing a scalable foundation for future enhancements.',
                    tags: ['C#', '.NET', 'WPF', 'Agile', 'ExpressSQL'],
                },
                {
                    date: 'Jun 2024 – Aug 2024',
                    role: 'Software Engineer Intern',
                    company: 'L3Harris',
                    link: 'https://l3harris.com',
                    description:
                        'I designed and developed a C# WPF-based pricing automation tool that improved operational efficiency by reducing quoting time by 98%. I led stakeholder discussions to align business requirements with the tool’s pricing logic, ensuring it met strategic objectives. As part of a six-member Scrum team, I resolved over 43 Agile tickets within nine weeks, contributing to consistent sprint success and enhanced product performance.',
                    tags: ['C#', '.NET', 'WPF', 'Agile'],
                },
                {
                    date: 'May 2021 – May 2024',
                    role: 'Assistant Manager',
                    company: 'C U Plastic',
                    link: 'https://cuplastic.com',
                    description:
                        'At C U Plastic, I drove operational improvements by implementing data-driven cross-department workflows that increased organizational efficiency by 20%. Through collaborative planning, I enhanced team productivity by 15% and improved internal documentation practices. Additionally, I developed and executed a new staging strategy that reduced truck-loading times by 25%, streamlining logistics and supporting faster turnaround.',
                    tags: ['Data Analysis', 'Workflow Optimization', 'Logistics', 'Operations Management'],
                },
            ],
        },
        {
            type: 'carousel',
            id: 'gallery',
            title: 'Career',
            images: [
                { src: 'assets/images/L3Harris-1.jpg', alt: 'L3Harris Tactical Communication' },
                { src: 'assets/images/L3Harris-2.jpg', alt: 'L3Harris Tactical Communication' },
                { src: 'assets/images/CU-Plastic.jpg', alt: 'C U Plastic' },
            ],
        },
        {
            type: 'projects',
            id: 'projects',
            title: 'Projects',
            entries: [
                {
                    date: '2025',
                    name: 'Job Board API',
                    description: 'Scraping 10,000 sites daily, with over 450k listings. Python, Cloudflare D1, RapidAPI.',
                },
                {
                    date: '2025',
                    name: 'ElaraHealth',
                    link: 'https://github.com/M1ght1203/elarahealth',
                    description: 'AI therapy app using Gemini 2.5, Next.js, Tailwind CSS, Vercel, Supabase.',
                },
                {
                    date: '2025',
                    name: 'Mission Uncrossable',
                    description: 'Crossy Road-style gambling game (based on the original Mission Uncrossable). Flutter, Dart, SQLite.',
                },
                {
                    date: '2023',
                    name: 'ShelfSync',
                    description: 'Custom internal warehouse management app. Flutter, Dart, PostgreSQL, Firebase.',
                },
                {
                    date: '2024',
                    name: 'ParkEase',
                    description: 'Parking lot management system. SQLite, Python.',
                },
                {
                    date: '2021',
                    name: 'Suzune',
                    description: 'Helping users buy, sell and trade digital trading cards. Python, RestAPI.',
                },
            ],
        },
    ],
};
