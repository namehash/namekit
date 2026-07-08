import random

from locust import HttpUser, task, between


input_labels = [
    'giancarloesposito',
    'piotrwiśniewski',
    'dragonfernandez',
    'wolfsmith',
    'mrscopcake',
    'likemrscopcake',
    'cryptocurrency',
    'blockchain',
    'yerbamate',
    'javascript',
    'superduper',
    'ucberkeley',
    'moshpit',
    'coffeebean',
    'laptoplaptop',
    'americanairlines',
    'usarmy',
    'greenriver',
    'counterstrike',
    'rocknroll',
    'sanfrancisco',
    'ilikeyourcat',
    'catlikeiyour',
    'xchange',
    'bball',
    'nft',
    'sdfbgfdbgjkdfjgdfhjfgdjfgdsjh',
    '[003fda97309fd6aa9d7753dcffa37da8bb964d0fb99eba99d0770e76fc5bac91]',
    'lapśtop',
    'łcatł',
    'laptop',
    'toplap',
    'repeatable',
    'bothering',
    'rakuten',
    'livecam',
    'miinibaashkiminasiganibiitoosijiganibadagwiingweshiganibakwezhigan',
    'yorknewŁyork123',
    'counterstrike',
    'avadakedavra',
    'lumosreparo',
    'americanairlines',
    'greenriver',
    'uc',
    'us',
    'nft',
]


class NameAIUser(HttpUser):
    wait_time = between(0.2, 1.6)

    @task(1)
    def inspect_label_get(self):
        self.client.get(f'/inspect-label/{random.choice(input_labels)}')

    @task(1)
    def inspect_label_post(self):
        self.client.post('/inspect-label', json={'label': random.choice(input_labels)})

    @task(1)
    def inspect_name(self):
        self.client.post(
            '/inspect-name', json={'name': f'{random.choice(input_labels)}.eth', 'network_name': 'mainnet'}
        )
