#!/usr/bin/env python3
"""Check JSON-LD against the published Schema.org vocabulary.

Requires network access, with no third-party Python dependencies. Checks types,
property domains, and typed-object ranges; this is not a hosted validator or a
Google rich-result eligibility test. scripts/check.py checks syntax/references.
"""
import json
from pathlib import Path
import re
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
VOCABULARY_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld'


def referenced_ids(value):
    if isinstance(value, list):
        return [item['@id'] for item in value]
    return [value['@id']] if value else []


def ancestors(type_id, vocabulary):
    result = {type_id}
    for parent in referenced_ids(vocabulary.get(type_id, {}).get('rdfs:subClassOf')):
        result.update(ancestors(parent, vocabulary))
    return result


def validate_entity(entity, vocabulary, page):
    if '@type' not in entity:
        return 0
    type_id = 'schema:' + entity['@type']
    assert type_id in vocabulary, (page, 'Unknown type', type_id)
    applicable_types = ancestors(type_id, vocabulary)
    count = 1
    for property_name, value in entity.items():
        if property_name.startswith('@'):
            continue
        property_id = 'schema:' + property_name
        assert property_id in vocabulary, (page, 'Unknown property', property_id)
        definition = vocabulary[property_id]
        domains = referenced_ids(definition.get('schema:domainIncludes'))
        assert not domains or applicable_types.intersection(domains), (page, type_id, property_id, 'domain')
        for item in value if isinstance(value, list) else [value]:
            if isinstance(item, dict) and '@type' in item:
                ranges = referenced_ids(definition.get('schema:rangeIncludes'))
                item_types = ancestors('schema:' + item['@type'], vocabulary)
                assert not ranges or item_types.intersection(ranges), (page, property_id, 'range')
                count += validate_entity(item, vocabulary, page)
    return count


def main():
    with urlopen(VOCABULARY_URL, timeout=30) as response:
        vocabulary = {node['@id']: node for node in json.load(response)['@graph']}
    count = 0
    for page in [ROOT / 'index.html', *sorted((ROOT / 'projects').rglob('index.html'))]:
        script = re.search(r'<script type="application/ld\+json">(.*?)</script>', page.read_text(), re.S)
        graph = json.loads(script[1])['@graph']
        count += sum(validate_entity(entity, vocabulary, page) for entity in graph)
        print('PASS:', page.relative_to(ROOT), 'types, property domains, typed-object ranges')
    print(f'Validated {count} entities against the official Schema.org vocabulary.')
    print('Run scripts/check.py for JSON syntax and identity-reference checks. This is not a hosted or rich-results test.')


if __name__ == '__main__':
    main()
