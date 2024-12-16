// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import Skeleton from "@/components/skeleton";
// import { NameGraphCategory } from "@namehash/namegraph-sdk/utils";

// interface QuickJumpsByCategoryProps {
//   onLoadedQuickJumpCategories: (loaded: boolean) => void;
//   activeCategoryID: string;
// }

// export const QuickJumpsByCategory = ({
//   onLoadedQuickJumpCategories,
//   activeCategoryID,
// }: QuickJumpsByCategoryProps) => {
//   const [quickJumpCategories, setQuickJumpCategories] = useState<
//     NameGraphCategory[] | null
//   >(null);

//   // Start of navigation buttons logic
//   const buildQuickJumpPills = () => {
//     if (Array.isArray(nameIdeas.categories)) {
//       const options: NKSuggestionCategory[] = [];

//       instantSearchData.nameIdeas?.categories.forEach((category: any) => {
//         options.push(category);
//       });

//       setQuickJumpCategories(options);
//     } else {
//       setQuickJumpCategories(null);
//     }
//   };

//   const quickJumpTo = (category: NKSuggestionCategory | null) => {
//     if (category) {
//       scrollToNameIdeasCategory(category);

//       setTimeout(() => {
//         dispatch(updateQuickJumpCollectionPillsTopmostPosition(true));
//       }, 1000);
//     }
//   };

//   useEffect(() => {
//     buildQuickJumpPills();
//   }, [instantSearchData.nameIdeas?.categories]);

//   useEffect(() => {
//     if (instantSearchData.nameIdeasLoading) {
//       setQuickJumpCategories(null);
//     }
//   }, [instantSearchData.nameIdeasLoading]);

//   useEffect(() => {
//     onLoadedQuickJumpCategories(quickJumpCategories !== null);
//   }, [quickJumpCategories]);

//   if (instantSearchData.nameIdeas?.categories === null) return null;

//   return (
//     <div className="relative bg-white">
//       {!quickJumpCategories ? (
//         <div className="mx-3 px-2 md:px-7 lg:px-12">
//           <QuickJumpPillsSkeleton />
//         </div>
//       ) : (
//         <div
//           className={`
//             pb-3 transition-all px-5 md:px-10 lg:px-[60px]
//             ${
//               instantSearchData.quickJumpBarIsAtTheTopmost
//                 ? "shadow bg-white"
//                 : ""
//             }
//           `}
//         >
//           <ArrowNavigationBar
//             skeletonMarkup={<QuickJumpPillsSkeleton />}
//             centerID={activeCategoryID || null}
//             barContentMarkup={
//               <div className="flex space-x-2">
//                 {/* Quick jump pills */}
//                 {quickJumpCategories?.map((category) => {
//                   return (
//                     <button
//                       onClick={() => quickJumpTo(category)}
//                       data-collection-pill={category.name}
//                       key={`${category.type}-${category.name}`}
//                       data-navigation-item={getCategoryID(category)}
//                       className={`collectionPill first:-pl-2 px-4 last:-mr-2 flex flex-nowrap cursor-pointer py-2 rounded-[20px] relative transition
//                         ${
//                           activeCategoryID === getCategoryID(category)
//                             ? "bg-black text-white hover:bg-gray-800"
//                             : "bg-gray-100 text-black hover:bg-gray-200"
//                         }
//                       `}
//                     >
//                       <p className="text-sm font-medium w-max cursor-pointer">
//                         {category.name}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             }
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// const QuickJumpPillsSkeleton = () => {
//   return (
//     <div className="flex space-x-2">
//       {[...Array(5).fill(0)].map((idx) => (
//         <Skeleton
//           roundedClass="rounded-[20px]"
//           className="h-9 w-32"
//           key={idx}
//         />
//       ))}
//     </div>
//   );
// };
