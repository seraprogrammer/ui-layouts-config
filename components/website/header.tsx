'use client';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  Github,
  Menu,
  MonitorSmartphone,
  Moon,
  MoonIcon,
  Sun,
  SunIcon,
  X,
} from 'lucide-react';
import { SearchDialog } from './searchbar';
// import MobileHeader from './moibile-header'

function Header() {
  const { setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Dispatch a custom event that the sidebar can listen for
    document.dispatchEvent(
      new CustomEvent('toggle-sidebar', {
        detail: { isOpen: !sidebarOpen },
      })
    );
  };

  return (
    <>
      <header className='fixed z-50 left-0 top-0 w-full border-b border-border/40 bg-white/60 dark:bg-black/60 px-3 py-3 backdrop-blur-xl shadow-sm'>
        <div className='mx-auto flex items-center justify-between gap-2 px-2 2xl:container'>
          {/* Mobile menu toggle button */}
          <button
            className='lg:hidden mr-2 p-2 rounded-md hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors duration-200'
            onClick={toggleSidebar}
            aria-label='Toggle sidebar menu'
          >
            <Menu className='h-5 w-5' />
          </button>

          <Link href='/' className='hidden lg:block'>
            <div className='relative hidden gap-2 lg:flex items-center group'>
              <svg
                version='1.1'
                id='Layer_1'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                x='0px'
                y='0px'
                width='15%'
                viewBox='0 0 500 500'
                enableBackground='new 0 0 500 500'
                xmlSpace='preserve'
              >
                <path
                  fill='#000000'
                  opacity='1.000000'
                  stroke='none'
                  d='
M323.000000,501.000000 
	C215.333359,501.000000 108.166718,501.000000 1.000057,501.000000 
	C1.000038,334.333405 1.000038,167.666794 1.000019,1.000147 
	C167.666565,1.000098 334.333130,1.000098 500.999756,1.000049 
	C500.999847,167.666519 500.999847,334.333038 500.999939,500.999786 
	C441.833344,501.000000 382.666656,501.000000 323.000000,501.000000 
M389.311188,412.917450 
	C392.512360,410.618805 395.758301,408.379669 398.907288,406.011627 
	C417.410217,392.097382 430.895630,374.373169 439.094421,352.701508 
	C446.231567,333.835968 450.154602,314.446442 446.916412,294.257050 
	C445.160858,283.311462 444.030609,271.886017 439.904816,261.785370 
	C432.990326,244.857391 424.314728,228.595901 415.633331,212.455658 
	C404.450134,191.664001 392.501709,171.284622 380.939117,150.696075 
	C373.507843,137.463776 365.120667,124.851303 354.427856,114.081963 
	C341.158722,100.717865 326.239288,89.631691 308.837036,81.794769 
	C293.380890,74.834236 277.300507,70.743637 260.631561,69.148285 
	C245.749619,67.723969 230.799667,69.373322 216.492279,73.426941 
	C185.352432,82.249596 159.395081,99.424141 141.902328,126.875977 
	C127.555923,149.390152 115.301247,173.239014 102.168648,196.524048 
	C95.885246,207.664932 89.264290,218.647644 83.617874,230.106857 
	C77.558525,242.404099 71.787689,254.931442 67.119736,267.803986 
	C61.312263,283.818878 59.754986,300.556702 60.846859,317.685394 
	C61.746975,331.805939 64.895958,345.274048 70.168839,358.214172 
	C75.347740,370.923615 83.085136,382.195557 92.110611,392.524658 
	C94.161522,394.871796 96.355743,397.710297 99.078735,398.722198 
	C104.372375,400.689392 106.933563,396.746368 109.175789,392.549896 
	C121.246078,369.959351 133.450333,347.440369 145.574631,324.878571 
	C157.463516,302.754852 169.304947,280.605621 181.180130,258.474548 
	C193.601303,235.325989 205.958755,212.142731 218.493851,189.055984 
	C227.888824,171.752609 239.742599,165.522385 254.460342,167.273193 
	C269.062988,169.010330 281.272949,176.231415 288.992706,189.253845 
	C298.859619,205.898285 308.306396,222.792358 317.886292,239.606155 
	C324.784576,251.713348 331.675018,263.826019 338.438141,276.008911 
	C344.256317,286.489624 350.539642,296.761963 349.095398,309.688721 
	C348.238129,317.362061 345.296600,323.464600 339.036957,328.001801 
	C331.794525,333.251434 323.382172,334.624451 314.828522,334.929962 
	C298.489868,335.513550 282.060883,333.782135 265.898407,337.956970 
	C238.386795,345.063263 214.953156,358.606934 198.590637,382.178345 
	C190.114532,394.388763 183.343048,407.804840 176.111389,420.848053 
	C172.021591,428.224548 173.629745,431.187378 181.884750,432.827698 
	C183.492996,433.147308 185.202835,432.994141 186.865814,432.994415 
	C231.198715,433.001434 275.531677,433.033264 319.864410,432.953308 
	C324.804718,432.944397 329.814911,432.703217 334.670959,431.864777 
	C353.658630,428.586395 372.054077,423.470276 389.311188,412.917450 
z'
                />
                <path
                  fill='#00BF63'
                  opacity='1.000000'
                  stroke='none'
                  d='
M388.951782,413.005890 
	C372.054077,423.470276 353.658630,428.586395 334.670959,431.864777 
	C329.814911,432.703217 324.804718,432.944397 319.864410,432.953308 
	C275.531677,433.033264 231.198715,433.001434 186.865814,432.994415 
	C185.202835,432.994141 183.492996,433.147308 181.884750,432.827698 
	C173.629745,431.187378 172.021591,428.224548 176.111389,420.848053 
	C183.343048,407.804840 190.114532,394.388763 198.590637,382.178345 
	C214.953156,358.606934 238.386795,345.063263 265.898407,337.956970 
	C282.060883,333.782135 298.489868,335.513550 314.828522,334.929962 
	C323.382172,334.624451 331.794525,333.251434 339.036957,328.001801 
	C345.296600,323.464600 348.238129,317.362061 349.095398,309.688721 
	C350.539642,296.761963 344.256317,286.489624 338.438141,276.008911 
	C331.675018,263.826019 324.784576,251.713348 317.886292,239.606155 
	C308.306396,222.792358 298.859619,205.898285 288.992706,189.253845 
	C281.272949,176.231415 269.062988,169.010330 254.460342,167.273193 
	C239.742599,165.522385 227.888824,171.752609 218.493851,189.055984 
	C205.958755,212.142731 193.601303,235.325989 181.180130,258.474548 
	C169.304947,280.605621 157.463516,302.754852 145.574631,324.878571 
	C133.450333,347.440369 121.246078,369.959351 109.175789,392.549896 
	C106.933563,396.746368 104.372375,400.689392 99.078735,398.722198 
	C96.355743,397.710297 94.161522,394.871796 92.110611,392.524658 
	C83.085136,382.195557 75.347740,370.923615 70.168839,358.214172 
	C64.895958,345.274048 61.746975,331.805939 60.846859,317.685394 
	C59.754986,300.556702 61.312263,283.818878 67.119736,267.803986 
	C71.787689,254.931442 77.558525,242.404099 83.617874,230.106857 
	C89.264290,218.647644 95.885246,207.664932 102.168648,196.524048 
	C115.301247,173.239014 127.555923,149.390152 141.902328,126.875977 
	C159.395081,99.424141 185.352432,82.249596 216.492279,73.426941 
	C230.799667,69.373322 245.749619,67.723969 260.631561,69.148285 
	C277.300507,70.743637 293.380890,74.834236 308.837036,81.794769 
	C326.239288,89.631691 341.158722,100.717865 354.427856,114.081963 
	C365.120667,124.851303 373.507843,137.463776 380.939117,150.696075 
	C392.501709,171.284622 404.450134,191.664001 415.633331,212.455658 
	C424.314728,228.595901 432.990326,244.857391 439.904816,261.785370 
	C444.030609,271.886017 445.160858,283.311462 446.916412,294.257050 
	C450.154602,314.446442 446.231567,333.835968 439.094421,352.701508 
	C430.895630,374.373169 417.410217,392.097382 398.907288,406.011627 
	C395.758301,408.379669 392.512360,410.618805 388.951782,413.005890 
z'
                />
              </svg>
            </div>
          </Link>

          {/* <MobileHeader /> */}
          <div className='flex gap-3'>
            <SearchDialog classname='w-60' />
            <a
              target='_blank'
              href='https://github.com/naymurdev/mdx-starter-repo'
              className='border w-10 flex-shrink-0 grid place-content-center rounded-full bg-background shadow-sm hover:bg-primary/10 hover:text-primary transition-all duration-300'
              aria-label='GitHub Repository'
            >
              <Github className='h-5 w-5' />
            </a>

            <a
              target='_blank'
              href='https://x.com/naymur_dev'
              className='border flex-shrink-0 bg-background text-foreground w-10 h-10 grid place-content-center rounded-full shadow-sm hover:bg-primary/10 hover:text-primary transition-all duration-300'
            >
              <svg
                width='120'
                height='109'
                viewBox='0 0 120 109'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='fill-current w-5 h-5'
              >
                <path d='M94.5068 0H112.907L72.7076 46.172L120 109H82.9692L53.9674 70.8942L20.7818 109H2.3693L45.3666 59.6147L0 0H37.9685L64.1848 34.8292L94.5068 0ZM88.0484 97.9318H98.2448L32.4288 10.4872H21.4882L88.0484 97.9318Z' />
              </svg>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='relative flex-shrink-0 grid w-10 h-10 place-content-center rounded-full border border-input/50 bg-background shadow-sm hover:bg-primary/10 hover:text-primary transition-all duration-300'>
                  <SunIcon className='block h-[1.2rem] w-[1.2rem] transition-all dark:hidden' />
                  <MoonIcon className='hidden h-[1.2rem] w-[1.2rem] transition-all dark:block' />
                  <span className='sr-only'>Toggle theme</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='animate-in fade-in-50 zoom-in-95 duration-200'
              >
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className='cursor-pointer'
                >
                  <Sun className='mr-2 h-4 w-4' /> Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('dark')}
                  className='cursor-pointer'
                >
                  <Moon className='mr-2 h-4 w-4' /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className='cursor-pointer'
                >
                  <MonitorSmartphone className='mr-2 h-4 w-4' /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
