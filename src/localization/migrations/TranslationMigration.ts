import { TranslationModel } from '../models/TranslationModel';
import { SupportedLanguages } from '../constants/SupportedLanguages';
import { TranslationUtils } from '../utils/TranslationUtils';

export interface ITranslationMigration {
  version: string;
  up: (translations: TranslationModel[]) => Promise<TranslationModel[]>;
  down: (translations: TranslationModel[]) => Promise<TranslationModel[]>;
}

export class TranslationMigration implements ITranslationMigration {
  constructor(
    public version: string,
    public up: (translations: TranslationModel[]) => Promise<TranslationModel[]>,
    public down: (translations: TranslationModel[]) => Promise<TranslationModel[]>
  ) {}

  async applyMigration(translations: TranslationModel[], targetVersion: string): Promise<TranslationModel[]> {
    const currentVersion = this.getCurrentVersion(translations);
    const isUpgrade = this.compareVersions(targetVersion, currentVersion) > 0;

    let migratedTranslations = [...translations];

    if (isUpgrade) {
      migratedTranslations = await this.up(migratedTranslations);
    } else {
      migratedTranslations = await this.down(migratedTranslations);
    }

    if (this.validateMigration(migratedTranslations)) {
      return migratedTranslations;
    } else {
      throw new Error('Migration validation failed');
    }
  }

  validateMigration(translations: TranslationModel[]): boolean {
    // Implement validation logic here
    // For example, check if all required fields are present and have valid values
    return translations.every(translation => {
      return (
        translation.id &&
        translation.language &&
        translation.key &&
        translation.value &&
        SupportedLanguages.includes(translation.language)
      );
    });
  }

  private getCurrentVersion(translations: TranslationModel[]): string {
    // Implement logic to determine the current version of translations
    // This could be stored in a metadata field or inferred from the structure
    return translations[0]?.version || '1.0.0';
  }

  private compareVersions(versionA: string, versionB: string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (partsA[i] > partsB[i]) return 1;
      if (partsA[i] < partsB[i]) return -1;
    }

    return 0;
  }
}

export function createTranslationMigration(
  version: string,
  up: (translations: TranslationModel[]) => Promise<TranslationModel[]>,
  down: (translations: TranslationModel[]) => Promise<TranslationModel[]>
): TranslationMigration {
  return new TranslationMigration(version, up, down);
}

export async function applyTranslationMigrations(
  translations: TranslationModel[],
  migrations: TranslationMigration[],
  targetVersion: string
): Promise<TranslationModel[]> {
  let currentTranslations = [...translations];
  const sortedMigrations = migrations.sort((a, b) => a.version.localeCompare(b.version));

  for (const migration of sortedMigrations) {
    if (migration.version === targetVersion) {
      break;
    }
    currentTranslations = await migration.applyMigration(currentTranslations, targetVersion);
  }

  return currentTranslations;
}

// Human tasks:
// 1. Implement specific migration strategies for different versions
// 2. Create unit tests for the TranslationMigration class and utility functions
// 3. Integrate the migration system with the main localization service
// 4. Implement a versioning system for translations if not already present
// 5. Create documentation for the migration process and how to create new migrations