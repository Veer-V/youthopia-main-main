export interface GalleryImage {
    id: number;
    src: string;
    title: string;
    alt: string;
}

export const galleryImages: GalleryImage[] = [
    {
        id: 1,
        src: 'https://picsum.photos/id/1040/400/600',
        title: 'Creative Canvas',
        alt: 'Students collaborating on a large painting.',
    },
    {
        id: 2,
        src: 'https://picsum.photos/id/10/400/600',
        title: 'Unity in Motion',
        alt: 'A group of students performing a dance routine.',
    },
    {
        id: 3,
        src: 'https://picsum.photos/id/1015/400/600',
        title: 'Open Mic Night',
        alt: 'A student singing passionately into a microphone on stage.',
    },
    {
        id: 4,
        src: 'https://picsum.photos/id/1025/400/600',
        title: 'Community Spirit',
        alt: 'A large group of students posing together and smiling.',
    },
    {
        id: 5,
        src: 'https://picsum.photos/id/1059/400/600',
        title: 'Theatrical Expressions',
        alt: 'Students performing a dramatic scene in a skit.',
    },
    {
        id: 6,
        src: 'https://picsum.photos/id/1069/400/600',
        title: 'Focused Minds',
        alt: 'Students engaged in a debate panel discussion.',
    },
    {
        id: 7,
        src: 'https://picsum.photos/id/1084/400/600',
        title: 'Crafting Connections',
        alt: 'Close-up of students working together on a craft project.',
    },
];
