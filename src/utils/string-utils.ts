export default {
  sanitiseAccents(name: string): string {
    return name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  },
};
