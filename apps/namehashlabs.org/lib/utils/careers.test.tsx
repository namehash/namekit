import React from "react";
import { getRelatedRoles } from "./careers";
import { Role, RoleCategory } from "@/types";
import { describe, it, expect } from "vitest";
import CategoriesData from "@/data/roleCategoryData";

describe("getRelatedRoles", () => {

    const buildTestRole = (title: string, category: RoleCategory): Role => {
            return {
                slug: title.toLowerCase().replace(/\s/g, "_"),
                title,
                category: category,
                team: "team",
                location: "location",
                description: (<div>description</div>),
            };
        };

    const frontendA = buildTestRole("Frontend A", CategoriesData.frontend);
    const frontendB = buildTestRole("Frontend B", CategoriesData.frontend);
    const backendA = buildTestRole("Backend A", CategoriesData.backend);
    const backendB = buildTestRole("Backend B", CategoriesData.backend);

    const allOpenRoles: Role[] = [frontendA, backendA, frontendB, backendB];

    it("should return an empty array when allOpenRoles is empty", () => {
        const relatedRoles = getRelatedRoles(frontendA, [], true, 3);
        expect(relatedRoles).toEqual([]);
    });

    it("should return an empty array when maxRelatedRoles is 0", () => {
        const relatedRoles = getRelatedRoles(frontendA, allOpenRoles, true, 0);
        expect(relatedRoles).toEqual([]);
    });

    it("should not return the same role being viewed", () => {
        const relatedRoles = getRelatedRoles(frontendA, allOpenRoles, true, allOpenRoles.length);
        expect(relatedRoles.length).toBe(allOpenRoles.length - 1);
        expect(relatedRoles).not.toContain(frontendA);
    });

    it("should return a subset of related roles when maxRelatedRoles is less than the length of allOpenRoles", () => {
        const relatedRoles = getRelatedRoles(frontendA, allOpenRoles, true, allOpenRoles.length - 2);
        expect(relatedRoles.length).toBe(allOpenRoles.length - 2);
        expect(relatedRoles).not.toContain(frontendA);
    });

    it("should return allOpenRoles (less duplicates) when maxRelatedRoles is greater than or equal to the length of allOpenRoles", () => {
        const relatedRoles = getRelatedRoles(frontendA, allOpenRoles, true, allOpenRoles.length);
        expect(relatedRoles.length).toBe(allOpenRoles.length - 1);

        const relatedRoles2 = getRelatedRoles(backendA, allOpenRoles, true, allOpenRoles.length + 1);
        expect(relatedRoles2.length).toBe(allOpenRoles.length - 1);
    });

    it("should return roles from the same category first", () => {
        const relatedRoles = getRelatedRoles(frontendA, allOpenRoles, false, 4);
        expect(relatedRoles.length).toBe(3);
        expect(relatedRoles[0].category).toBe(CategoriesData.frontend);
        expect(relatedRoles[1].category).toBe(CategoriesData.backend);
        expect(relatedRoles[2].category).toBe(CategoriesData.backend);
    });

    it("should never return duplicates", () => {
        const relatedRoles = getRelatedRoles(frontendA, [frontendA, frontendB, frontendB], false, 4);
        expect(relatedRoles.length).toBe(1);
    });
});