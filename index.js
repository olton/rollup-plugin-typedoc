import TypeDoc from 'typedoc'
import merge from 'lodash.merge'

const pluginName = 'rollup-plugin-typedoc';

const defaultTypedocOptions = {
    exclude: '**/node_modules/**/*.*',
    excludeExternals: true,
    out: './docs',
    markdownItOptions: {
        "html": true,
        "linkify": true
    }
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
    const app = await TypeDoc.Application.bootstrap(options);

    app.options.addReader(new TypeDoc.TSConfigReader());
    app.options.addReader(new TypeDoc.TypeDocReader());

    const project = await app.convert();

    if (project) {
        if (options.json) {
            try {
                await app.generateJson(project, options.json);
            } catch (e) {}
        }
        if (!options.json || options.out) {
            try {
                await app.generateDocs(project, options.out);
            } catch (e) {}
        }
    }
}

export default rollupTypedoc
