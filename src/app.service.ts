import * as handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getStats(user: string): Promise<string> {
    const template = await fetch(
      `https://raw.githubusercontent.com/QuadriniL/public-templates/main/assets/handlebars/stats.hbs`,
    ).then((r) => r.text());

    const githubStats = await fetch(
      `https://api.github.com/search/commits?q=author:${user}`,
    ).then((res) => res.json());

    const gitProfileRepos = await fetch(
      `https://api.github.com/users/${user}/repos`,
    ).then((res) => res.json());

    const stars = gitProfileRepos.reduce(
      (acc, repo) => acc + repo.stargazers_count,
      0,
    );

    const languages = gitProfileRepos.map((repo) => repo.language);

    for (let i = 0; i < languages.length; i++) {
      if (languages[i] === null) {
        languages.splice(i, 1);
      }
    }

    const languagesWithCount = languages.reduce((acc, language) => {
      if (acc[language]) {
        acc[language] += 1;
      } else {
        acc[language] = 1;
      }
      return acc;
    }, {});

    const commits = githubStats.total_count;

    const compiled = handlebars.compile(template);
    return compiled({
      commits,
      stars,
      languages: Object.keys(languagesWithCount).length,
      user,
    });
  }
}
