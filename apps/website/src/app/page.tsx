export default function Home() {
  return (
    <>
      <div className="md:p-32 relative z-10">
        <p>This is the landing page</p>

        <section className="py-24">
          <div className="max-w-2xl mx-auto px-6">
            <div className="space-y-5 text-center">
              <div className="rounded-full px-4 py-2 inline-flex bg-gray-200/50 space-x-2 items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.1875 10C7.1875 10.1726 7.04759 10.3125 6.875 10.3125C6.70241 10.3125 6.5625 10.1726 6.5625 10C6.5625 9.82741 6.70241 9.6875 6.875 9.6875C7.04759 9.6875 7.1875 9.82741 7.1875 10ZM7.1875 10H6.875M10.3125 10C10.3125 10.1726 10.1726 10.3125 10 10.3125C9.82741 10.3125 9.6875 10.1726 9.6875 10C9.6875 9.82741 9.82741 9.6875 10 9.6875C10.1726 9.6875 10.3125 9.82741 10.3125 10ZM10.3125 10H10M13.4375 10C13.4375 10.1726 13.2976 10.3125 13.125 10.3125C12.9524 10.3125 12.8125 10.1726 12.8125 10C12.8125 9.82741 12.9524 9.6875 13.125 9.6875C13.2976 9.6875 13.4375 9.82741 13.4375 10ZM13.4375 10H13.125M17.5 10C17.5 13.797 14.1421 16.875 10 16.875C9.26044 16.875 8.54588 16.7769 7.87098 16.5941C7.05847 17.1649 6.06834 17.5 5 17.5C4.83398 17.5 4.6698 17.4919 4.50806 17.4761C4.375 17.4631 4.24316 17.4449 4.11316 17.4216C4.5161 16.9461 4.80231 16.3689 4.92824 15.734C5.00378 15.3531 4.81725 14.9832 4.53903 14.7124C3.27475 13.4818 2.5 11.8238 2.5 10C2.5 6.20304 5.85786 3.125 10 3.125C14.1421 3.125 17.5 6.20304 17.5 10Z"
                    stroke="#808080"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-black font-medium text-sm">
                  For Web3 messengers
                </span>
              </div>

              <h1 className="text-black text-4xl font-bold">
                Protect from
                <br className="hidden md:block" /> impersonation attacks
              </h1>

              <p className="text-gray-500 text-lg">
                Current primary name lookups still display deceptive look-alike
                names such as &quot;vitalík.eth&quot; that go undetected during
                `ens_normalize` checks. NameGuard&apos;s advanced
                &apos;canonical name&apos; algorithm exposes copycat attempts
                and ensures a safe messaging experience for all.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-0 z-0 h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </>
  );
}
