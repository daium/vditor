import {getMarkdown} from "../util/getMarkdown";

export const afterRenderEvent = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    clearTimeout(vditor.wysiwyg.afterRenderTimeoutId);
    vditor.wysiwyg.afterRenderTimeoutId = window.setTimeout(() => {
        if (vditor.wysiwyg.composingLock) {
            return;
        }
        const text = getMarkdown(vditor);
        if (typeof vditor.options.input === "function" && options.enableInput) {
            vditor.options.input(text);
        }

        if (vditor.options.counter > 0) {
            vditor.counter.render(text.length, vditor.options.counter);
        }

        if (vditor.options.cache) {
            localStorage.setItem(`vditor${vditor.id}`, text);
        }

        if (vditor.devtools) {
            vditor.devtools.renderEchart(vditor);
        }

        if (options.enableAddUndoStack) {
            vditor.wysiwygUndo.addToUndoStack(vditor);
        }

        if (options.enableHint && vditor.hint) {
            vditor.hint.render(vditor);
        }
    }, 800);
};
