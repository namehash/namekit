/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        /**
         * The Suspense boundary is necessary as per:
         * 
         * We are disabling this need as this would turn the usage
         * of search params very much difficult in our application.
         * 
         * We do this disabling then, basically to be able to use
         * "useSearchParams" without the Suspense boundary which is not
         * harmful for our use case. 
         * 
         * There is no risk on disabling this and this can be understood by understanding:
         * 1. Next.js itself allows it;
         * 2. "Reading search parameters through useSearchParams() without 
         *    a Suspense boundary will opt the entire page into client-side rendering"
         *    which is not really a problem for our use case; 
         * 
         * For diving deeper on this, please refer to:
         * 
         * https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout#why-this-error-occurred 
         */
        missingSuspenseWithCSRBailout: false,
    }
};

export default nextConfig;
