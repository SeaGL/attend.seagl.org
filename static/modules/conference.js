class ConferenceModule {
    static moduleApiVersion = "^2.0.0";

    constructor(api) {
        this.api = api;
    }

    async load() {
        this.api.customisations.registerShouldShowComponent(this.shouldShowComponent);
    }

    shouldShowComponent = (component) => {
        if (component === "UIComponent.spaceCreation") return false;

        return true;
    };
}

export default ConferenceModule;
