import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * This abstract class serves as the foundation for all model classes in the Excel project,
 * providing common properties and methods for data management and cross-platform compatibility.
 */
export abstract class BaseModel {
  /**
   * Unique identifier for the model instance
   */
  public readonly id: string;

  /**
   * Timestamp of when the model instance was created
   */
  public readonly createdAt: Date;

  /**
   * Timestamp of when the model instance was last updated
   */
  public updatedAt: Date;

  /**
   * Observable for tracking changes to the model instance
   */
  public changes$: Observable<Partial<this>>;

  /**
   * Initializes a new instance of the BaseModel class, optionally accepting an id parameter.
   * @param id Optional unique identifier for the model instance
   */
  constructor(id?: string) {
    this.id = id || uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.changes$ = new Observable<Partial<this>>();
  }

  /**
   * Updates the model instance with the provided changes and emits the changes through the changes$ observable.
   * @param changes Partial object containing the properties to be updated
   */
  public update(changes: Partial<this>): void {
    Object.assign(this, changes);
    this.updatedAt = new Date();
    (this.changes$ as any).next(changes);
  }

  /**
   * Returns a plain JavaScript object representation of the model instance.
   * @returns A plain JavaScript object representation of the model
   */
  public toJSON(): object {
    const obj: any = {};
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        obj[prop] = this[prop];
      }
    }
    return obj;
  }
}