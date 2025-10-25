import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SwitchDark } from '..';
import Test from '../test';

function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 shadow-lg transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-50 liquid-glass rounded-lg m-2 ml-0">
      <div className="flex w-full items-center gap-1 px-4 ">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Test />
          <SwitchDark />
        </div>
      </div>
    </header>
  );
}
export default SiteHeader;
