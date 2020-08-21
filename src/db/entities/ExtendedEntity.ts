import { BaseEntity } from "typeorm";
import { ServiceException } from "../../core/exception";
import { pick } from "../../util/object";

export class ExtendedEntity extends BaseEntity {
  public dto() {
    throw ServiceException.build(500, `Method ${this.constructor.name}::dto is not implemented`);
  }

  public pick(...keys: (keyof this)[]) {
    return pick(this, keys);
  }
};