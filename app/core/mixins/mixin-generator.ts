/**
 * takes care of generating mixins at runtime
 */
export class MixinGenerator {
  /**
   * takes a class and an array of mixins which the give class should be derive from
   *
   * @param derivedClass the class which should derive from the given mixins
   * @param mixinClasses the mixin classes
   */
  static apply(derivedClass: any, mixinClasses: any[]): void {
    mixinClasses.forEach(mixinClass => {
      Object.getOwnPropertyNames(mixinClass.prototype).forEach(name => {
        derivedClass.prototype[name] = mixinClass.prototype[name];
      });
    });
  }
}
