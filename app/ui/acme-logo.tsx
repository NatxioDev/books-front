import { BookOpenIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <BookOpenIcon/>
      <p className="text-[44px]">Books</p>
    </div>
  );
}
