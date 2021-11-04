import type { IComponentVisibilityCustomisations } from "matrix-react-sdk/src/customisations/ComponentVisibility";
import { UIComponent } from "matrix-react-sdk/src/settings/UIFeature";

export const ComponentVisibilityCustomisations: IComponentVisibilityCustomisations = {
    shouldShowComponent(component) {
        if (component === UIComponent.CreateSpaces) return false;

        return true;
    },
};
