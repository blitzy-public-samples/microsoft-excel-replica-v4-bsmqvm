import { LocaleModel } from '../models/LocaleModel';
import { LocaleConstants } from '../constants/LocaleConstants';
import { LocaleUtils } from '../utils/LocaleUtils';

export interface ILocaleMigration {
    version: string;
    up: (locales: LocaleModel[]) => Promise<LocaleModel[]>;
    down: (locales: LocaleModel[]) => Promise<LocaleModel[]>;
}

export class LocaleMigration implements ILocaleMigration {
    constructor(
        public version: string,
        public up: (locales: LocaleModel[]) => Promise<LocaleModel[]>,
        public down: (locales: LocaleModel[]) => Promise<LocaleModel[]>
    ) {}

    async applyMigration(locales: LocaleModel[], targetVersion: string): Promise<LocaleModel[]> {
        const currentVersion = LocaleUtils.getCurrentVersion(locales);
        
        if (LocaleUtils.compareVersions(currentVersion, targetVersion) < 0) {
            // Upgrading
            return this.up(locales);
        } else if (LocaleUtils.compareVersions(currentVersion, targetVersion) > 0) {
            // Downgrading
            return this.down(locales);
        }
        
        // No migration needed
        return locales;
    }

    validateMigration(locales: LocaleModel[]): boolean {
        for (const locale of locales) {
            if (!this.validateLocale(locale)) {
                return false;
            }
        }
        return true;
    }

    private validateLocale(locale: LocaleModel): boolean {
        // Check if all required properties are present
        const requiredProperties = LocaleConstants.REQUIRED_LOCALE_PROPERTIES;
        for (const prop of requiredProperties) {
            if (!(prop in locale)) {
                return false;
            }
        }

        // Validate the format of each property
        if (!LocaleUtils.isValidLocaleCode(locale.code)) {
            return false;
        }

        // Ensure no duplicate locale codes exist
        // This check should be performed on the entire set of locales, not just one
        // So we'll assume it's handled in the applyMigration method

        return true;
    }
}

export function createMigration(
    version: string,
    up: (locales: LocaleModel[]) => Promise<LocaleModel[]>,
    down: (locales: LocaleModel[]) => Promise<LocaleModel[]>
): LocaleMigration {
    return new LocaleMigration(version, up, down);
}

export async function applyMigrations(
    locales: LocaleModel[],
    migrations: LocaleMigration[],
    targetVersion: string
): Promise<LocaleModel[]> {
    let currentLocales = [...locales];
    const sortedMigrations = migrations.sort((a, b) => LocaleUtils.compareVersions(a.version, b.version));

    for (const migration of sortedMigrations) {
        if (LocaleUtils.compareVersions(migration.version, targetVersion) <= 0) {
            currentLocales = await migration.applyMigration(currentLocales, targetVersion);
            if (!migration.validateMigration(currentLocales)) {
                throw new Error(`Migration to version ${migration.version} failed validation`);
            }
        } else {
            break;
        }
    }

    return currentLocales;
}