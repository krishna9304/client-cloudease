'use client';
import { NewProjectFormValues, initialProjectFormValues } from '@/components/CreateNewProject';
import apiClient from '@/utils/axios.util';
import { ApiRoutes } from '@/utils/routes.util';
import { Terminal } from '@xterm/xterm';
import { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

const ConsolePage: NextPage = () => {
  const term = new Terminal({
    scrollOnUserInput: true,
    cursorBlink: true,
    cursorStyle: 'underline',
    convertEol: true,
  });
  const [project, setProject] = useState<NewProjectFormValues>(initialProjectFormValues);
  const query = useSearchParams();
  const router = useRouter();

  const terminalRef = useRef<HTMLDivElement | null>(null);

  const fetchProject = async () => {
    if (!query.has('project')) {
      toast.error('No project id found. Redirecting to home page...');
      router.push('/');
    } else {
      try {
        const res = await apiClient.get(ApiRoutes.project.get(query.get('project') as string));
        const data = res.data;
        setProject(data.data.project);
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching the design. Redirecting to home page...');
        router.push('/');
      }
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const streamLogs = async () => {
    const eventSource = new EventSource(
      ApiRoutes.baseUri() + ApiRoutes.project.streamLogs(project.projectId as string),
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      term.write(data);
    };
    eventSource.onerror = (event) => {
      console.error(event);
      eventSource.close();
    };
  };

  useEffect(() => {
    if (terminalRef.current && project.projectId) {
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalRef.current);
      fitAddon.fit();
      term.focus();
      term.write('Connecting to server...\n');
      streamLogs();
    }
    return () => {
      term.dispose();
    };
  }, [project, terminalRef]);

  return <div ref={terminalRef} style={{ height: '92vh', width: '100vw' }}></div>;
};

export default ConsolePage;
