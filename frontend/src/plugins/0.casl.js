import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'

const { can, rules } = new AbilityBuilder(createMongoAbility)

// Default ability: allow navigation/views until backend-driven ACL is wired.
can('manage', 'all')

const ability = createMongoAbility(rules)

export default function (app) {
  app.use(abilitiesPlugin, ability, {
    useGlobalProperties: true,
  })
}
