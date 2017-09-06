export default class Utilities {
    public static parseArguments(args: string[]): { dest: string, template: string } {
        return args.reduce((accu: { dest: string, template: string }, current: string) => {
            // Parse out options if they exist
            // These will always lead with -- separated by = (--config=./test.config)
            if (current.indexOf("--") > -1) {
                const keyValue = current.split("--")[1].split("=");

                return {
                    [keyValue[0]]: keyValue[1] || true,
                    ...accu
                };
            }

            // First non-option value will always be the template name
            if (!accu.template) {
                return {
                    template: current,
                    ...accu
                };
            }

            // Second non-option value will always be the destination
            if (!accu.dest) {
                return {
                    dest: current,
                    ...accu
                };
            }

            return accu;
        }, {}) as { dest: string, template: string };
    }
}
