import { defineRule } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import fr from '@vee-validate/i18n/dist/locale/fr.json';
import ar from '@vee-validate/i18n/dist/locale/ar.json';
import it from '@vee-validate/i18n/dist/locale/it.json';
import pl from '@vee-validate/i18n/dist/locale/pl.json';
import es from '@vee-validate/i18n/dist/locale/es.json';
import de from '@vee-validate/i18n/dist/locale/de.json';


configure({
    generateMessage: localize({
        en,
        fr,
        ar,
        it,
        pl,
        es,
        de
    }),
});


defineRule('required', required);
defineRule('email', email);
defineRule('min', min);