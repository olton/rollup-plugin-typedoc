import TypeDoc from 'typedoc'
import merge from 'lodash.merge'

const pluginName = 'rollup-plugin-typedoc';

const defaultTypedocOptions = {
    exclude: '**/node_modules/**/*.*',
    excludeExternals: true,
    out: './docs',
    nojekyll: false // ??
};

function rollupTypedoc(options) {
    const typedocOptions = merge(defaultTypedocOptions, options);

    return {
        name: pluginName,
        writeBundle() {
            return generateDocs(typedocOptions).catch(console.error);
        },
    };
}

async function generateDocs(options) {
    const app = new TypeDoc.Application();

    app.options.addReader(new TypeDoc.TSConfigReader());
    app.options.addReader(new TypeDoc.TypeDocReader());
    app.bootstrap(options);

    const project = app.convert();

    if (project) {
        if (options.json) {
            console.log('Generating typedoc json');
            await app.generateJson(project, options.json);
        } else {
            console.log('Generating updated typedocs');
            await app.generateDocs(project, options.out);
        }
    }
}

export default rollupTypedoc
