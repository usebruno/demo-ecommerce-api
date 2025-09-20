import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('opencollection')
  getOpenCollection(@Res() res: Response) {
    try {
      // Read the HTML file
      const htmlPath = path.join(__dirname, '..', 'resources', 'opencollection.html');
      let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

      // Read the YAML collection data
      const yamlPath = path.join(__dirname, '..', 'resources', 'opencollection.yml');
      const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
      const collectionData = yaml.load(yamlContent);

      // Convert to JSON and inject into HTML
      const jsonData = JSON.stringify(collectionData, null, 2);
      htmlContent = htmlContent.replace('sampleCollection', jsonData);

      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      res.status(500).send('Error loading OpenCollection');
    }
  }
}
