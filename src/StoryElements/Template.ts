import Story from "./Story.ts"

type Instance<T> = {
    title: string,
    instance: T,
}
class Template {
	template: Story;
	instances: Instance<Story>[];

    constructor(template?: Story, instances: Instance<Story>[] = []) {
        this.template = template ?? new Story();
        this.instances = instances;
    }

    public instantiate() {
        this.instances.push({title: `Istanza ${this.instances.length + 1}`, instance: this.template.instantiate()});
        return this;
    }
}

export default Template;