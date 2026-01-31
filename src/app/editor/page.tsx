'use client';

import { Editor, Frame, Element } from '@craftjs/core';
import { Hero, Features, Testimonials, Pricing, FAQ, CTA } from '../../components/blocks';
import { Canvas } from '../../components/editor/Canvas';
import { Toolbox } from '../../components/editor/Toolbox';
import { SettingsPanel } from '../../components/editor/SettingsPanel';
import { EditorHeader } from '../../components/editor/EditorHeader';

export default function EditorPage() {
  return (
    <Editor
      resolver={{
        Canvas,
        Hero,
        Features,
        Testimonials,
        Pricing,
        FAQ,
        CTA,
      }}
    >
      <div className="h-screen flex flex-col bg-gray-100">
        <EditorHeader funnelName="My Funnel" />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Toolbox */}
          <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <Toolbox />
          </aside>
          
          {/* Main Canvas Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              <Frame>
                <Element is={Canvas} canvas>
                  {/* Default starting blocks */}
                  <Element is={Hero} />
                  <Element is={Features} />
                </Element>
              </Frame>
            </div>
          </main>
          
          {/* Right Sidebar - Settings */}
          <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <SettingsPanel />
          </aside>
        </div>
      </div>
    </Editor>
  );
}
