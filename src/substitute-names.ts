export function substituteNames<T>(
  stats: Record<string, T>,
  substitutes: Record<string, string>
) {
  const statsWithSubstitutedNames: Record<string, T> = {};

  Object.entries(stats).forEach(([name, value]) => {
    const substitutedName = substitutes[name] || name;

    statsWithSubstitutedNames[substitutedName] = value;
  });

  return statsWithSubstitutedNames;
}
