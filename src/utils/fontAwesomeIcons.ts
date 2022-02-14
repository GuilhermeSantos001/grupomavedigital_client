/**
 * @description Exporta todos os ícones do fontawesome
 * @author GuilhermeSantos001
 * @update 30/09/2021
 */

import {
  IconProp,
  IconPrefix,
  IconName
} from '@fortawesome/fontawesome-svg-core'

import { library } from "@fortawesome/fontawesome-svg-core";
import * as solid from "@fortawesome/free-solid-svg-icons";
import * as regular from "@fortawesome/free-regular-svg-icons";
import * as brands from "@fortawesome/free-brands-svg-icons";

import Sugar from 'sugar';

export type iconsFamily = IconPrefix;
export type iconsName = IconName;

class Icon {
  private readonly definitions: string[];

  constructor() {
    this.definitions = [];
  }

  private hasDefined(name: string): boolean {
    return this.definitions.filter(definition => definition === name).length > 0;
  }

  private appendDefinitions(name: string): void {
    this.definitions.push(name);
  }

  public render(prefix: IconPrefix, name: IconName): IconProp {
    const definition: any = `fa${Sugar.String.camelize(name)}`;

    if (!this.hasDefined(definition)) {
      if (prefix === 'fas') {
        if (solid[definition]) {
          this.appendDefinitions(definition);
          library.add(solid[definition]);
        }
      } else if (prefix === 'far') {
        if (regular[definition]) {
          this.appendDefinitions(definition);
          library.add(regular[definition]);
        }
      } else if (prefix === 'fab') {
        if (brands[definition]) {
          this.appendDefinitions(definition);
          library.add(brands[definition]);
        }
      }
    }

    return [prefix, name];
  }
}

const icon = new Icon();

export default icon;