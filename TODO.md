- [ ] Rewrite components/aliments/AddAlimentModal.tsx so AlimentFormData + inputs exactly match prisma/schema.prisma (ufl_per_kg_ms, pdie_per_kg_ms, pdin_per_kg_ms, ufv_per_kg_ms, etc.)

- [ ] Remove filteredCompositionFields usage and use compositionFields instead; fix dynamic indexing typing
- [ ] Rewrite components/aliments/AlimentsClient.tsx so sorting/display uses prisma field names (ufl_per_kg_ms, pdie_per_kg_ms, etc.)
- [ ] Fix ReactNode type error by ensuring only primitive nutrition values are rendered (never stock object)
- [ ] Run `npx tsc -p tsconfig.json --noEmit`
- [ ] Run `npm run lint`
- [ ] Ensure `npm run build` succeeds

