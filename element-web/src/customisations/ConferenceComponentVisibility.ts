import type { ComponentVisibilityCustomisations as IComponentVisibilityCustomisations } from "@element-hq/element-web-module-api";
import { UIComponent } from "../settings/UIFeature";

export const ComponentVisibilityCustomisations: IComponentVisibilityCustomisations = {
    shouldShowComponent(component) {
        if (component === UIComponent.CreateSpaces) return false;

        return true;
    },
};
